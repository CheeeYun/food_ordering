import jwt from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    // 從 cookie 取得 JWT token
    const token = getCookie(event, 'auth-token');
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - No token provided',
      });
    }

    // 驗證 JWT token
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    const merchantId = decoded.merchantId;

    // 取得商家資訊
    const merchant = await prisma.merchant.findUnique({
      where: {id: merchantId},
      select: {
        id: true,
        name: true,
        lineId: true,
        username: true,
        store_name: true,
        store_description: true,
        phone: true,
        email: true,
        address: true,
        line_channel_id: true,
        line_channel_secret: true,
        line_channel_access_token: true,
        telegram_chat_id: true,
        linePay_channel_id: true,
        linePay_secret_key: true,
        subscriptionStatus: true,
        createdAt: true,
        is_active: true,
        order_service_active: true,
        available_dining_types: true,
        available_payment_methods: true,
        advance_discount_rate: true,
        delivery_minimum_amount: true,
        delivery_base_fee: true,
        delivery_free_km: true,
        delivery_per_km_fee: true,
        delivery_prepayment: true,
        max_delivery_distance: true,
        bank_account: true,
        manual_override_until_midnight: true,
        last_reset_date: true,
      },
    });

    if (!merchant) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Merchant not found',
      });
    }

    return {
      success: true,
      data: merchant,
    };
  } catch (error: any) {
    console.error('Get merchant info error:', error);

    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token',
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get merchant info',
    });
  }
});
