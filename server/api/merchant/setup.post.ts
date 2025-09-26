// server/api/merchant/setup.post.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const authToken = getCookie(event, 'auth-token');

  if (!authToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  try {
    const decoded = jwt.verify(authToken, config.jwtSecret) as any;

    const body = await readBody(event);
    const {
      store_name,
      store_description,
      phone,
      email,
      address,
      is_active,
      order_service_active,
      available_dining_types,
      available_payment_methods,
      advance_discount_rate,
      delivery_minimum_amount,
      delivery_base_fee,
      delivery_free_km,
      delivery_per_km_fee,
      delivery_prepayment,
      max_delivery_distance,
      bank_account,
      username,
      password,
    } = body;

    const getTaipeiTime = () => {
      return new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
    };

    // 更新商家基本資料
    const updateData = {
      store_name: store_name?.trim(),
      store_description: store_description?.trim() || null,
      phone: phone?.trim(),
      email: email?.trim(),
      address: address?.trim(),
      updatedAt: getTaipeiTime(),
      is_active: is_active,
    };

    // 如果有提供訂餐設定，則加入更新資料
    if (available_dining_types !== undefined) {
      updateData.available_dining_types = available_dining_types;
    }

    if (available_payment_methods !== undefined) {
      updateData.available_payment_methods = available_payment_methods;
    }

    if (advance_discount_rate !== undefined) {
      updateData.advance_discount_rate = advance_discount_rate;
    }

    if (delivery_minimum_amount !== undefined) {
      updateData.delivery_minimum_amount = delivery_minimum_amount;
    }

    if (delivery_base_fee !== undefined) {
      updateData.delivery_base_fee = delivery_base_fee;
    }

    if (delivery_free_km !== undefined) {
      updateData.delivery_free_km = delivery_free_km;
    }

    if (delivery_per_km_fee !== undefined) {
      updateData.delivery_per_km_fee = delivery_per_km_fee;
    }

    if (delivery_prepayment !== undefined) {
      updateData.delivery_prepayment = delivery_prepayment;
    }

    if (max_delivery_distance !== undefined) {
      updateData.max_delivery_distance = max_delivery_distance;
    }

    if (bank_account !== undefined) {
      updateData.bank_account = bank_account;
    }

    if (order_service_active !== undefined) {
      updateData.order_service_active = order_service_active;
    }

    // 如果有提供員工帳號和密碼，則加入更新資料
    if (username !== undefined) {
      // 檢查帳號是否已被使用（排除自己）
      const existingMerchant = await prisma.merchant.findUnique({
        where: { username: username.trim() }
      });
      
      if (existingMerchant && existingMerchant.id !== decoded.merchantId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Username already exists',
        });
      }
      
      updateData.username = username.trim();
    }

    if (password !== undefined && password.trim()) {
      // 對密碼進行雜湊
      const saltRounds = 12;
      updateData.password_hash = await bcrypt.hash(password, saltRounds);
    }

    // 如果有提供地址，則加入更新資料
    if (address !== undefined) {
      updateData.address = address?.trim() || null;
    }

    // // 如果有提供營業狀態，則加入更新資料
    if (is_active !== undefined) {
      updateData.is_active = is_active;
    }

    await prisma.merchant.update({
      where: {id: decoded.merchantId},
      data: updateData,
    });

    return {success: true};
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token',
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Setup failed',
    });
  }
});
