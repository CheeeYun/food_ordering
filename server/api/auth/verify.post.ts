import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  try {
    const body = await readBody(event);
    const { token } = body;

    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token is required',
      });
    }

    // 驗證 JWT token
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    
    // 檢查商家是否仍然存在且啟用
    const merchant = await prisma.merchant.findUnique({
      where: { id: decoded.merchantId },
      select: {
        id: true,
        username: true,
        is_active: true,
      }
    });

    if (!merchant || !merchant.is_active) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token or account disabled',
      });
    }

    return {
      success: true,
      data: {
        valid: true,
        merchant: {
          id: merchant.id,
          username: merchant.username,
        }
      }
    };
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token',
      });
    }
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Token verification failed',
    });
  }
});