import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const token = getCookie(event, 'auth-token');
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret) as any;
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token'
      });
    }

    const merchantId = decoded.merchantId;

    // 獲取商家的累積訂單數和累積金額
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      select: {
        total_orders: true,
        total_revenue: true,
        store_name: true
      }
    });

    if (!merchant) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Merchant not found'
      });
    }

    return {
      success: true,
      data: {
        totalOrders: merchant.total_orders || 0,
        totalRevenue: Number(merchant.total_revenue || 0),
        storeName: merchant.store_name
      }
    };

  } catch (error) {
    console.error('Failed to get order statistics:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get order statistics'
    });
  }
});