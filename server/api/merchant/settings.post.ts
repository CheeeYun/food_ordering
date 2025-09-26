import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

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

    // 讀取請求內容
    const body = await readBody(event);
    const {
      line_channel_id,
      line_channel_secret,
      line_channel_access_token,
      telegram_chat_id,
      linePay_channel_id,
      linePay_secret_key,
    } = body;

    const getTaipeiTime = () => {
      return new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
    };

    // 更新商家進階設定
    const merchant = await prisma.merchant.update({
      where: { id: merchantId },
      data: {
        line_channel_id: line_channel_id?.trim(),
        line_channel_secret: line_channel_secret?.trim(),
        line_channel_access_token: line_channel_access_token?.trim(),
        telegram_chat_id: telegram_chat_id?.trim() || null,
        linePay_channel_id: linePay_channel_id?.trim() || null,
        linePay_secret_key: linePay_secret_key?.trim() || null,
        updatedAt: getTaipeiTime(),
      },
    });

    return {
      success: true,
      message: '進階設定已更新',
      data: {
        line_channel_id: merchant.line_channel_id,
        telegram_chat_id: merchant.telegram_chat_id,
      },
    };
  } catch (error) {
    console.error('Settings update error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token',
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Settings update failed',
    });
  }
});