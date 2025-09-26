import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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

    const body = await readBody(event);
    const { newPassword } = body;

    if (!newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'New password is required',
      });
    }

    // 驗證新密碼長度
    if (newPassword.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'New password must be at least 6 characters long',
      });
    }

    // 確認商家存在
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      select: {
        id: true,
      }
    });

    if (!merchant) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Merchant not found',
      });
    }

    // 雜湊新密碼
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // 更新密碼
    await prisma.merchant.update({
      where: { id: merchantId },
      data: {
        password_hash: newPasswordHash,
        updatedAt: new Date(new Date().getTime() + 8 * 60 * 60 * 1000), // 台灣時間
      }
    });

    return {
      success: true,
      message: 'Password reset successfully'
    };
  } catch (error: any) {
    console.error('Reset password error:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to reset password',
    });
  }
});