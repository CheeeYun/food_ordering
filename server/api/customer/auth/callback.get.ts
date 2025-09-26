import jwt from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const {code, state} = query;

  // 驗證 state 參數
  const savedStateWithMerchant = getCookie(event, 'customer_oauth_state');
  if (!state || !savedStateWithMerchant) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid state parameter',
    });
  }

  const [savedState, merchantId] = savedStateWithMerchant.split(':');
  if (state !== savedState) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid state parameter',
    });
  }

  // 清除 state cookie
  deleteCookie(event, 'customer_oauth_state');

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Authorization code not provided',
    });
  }

  try {
    // 取得商家資訊
    const merchant = await prisma.merchant.findUnique({
      where: {lineId: merchantId},
      select: {
        id: true,
        line_channel_id: true,
        line_channel_secret: true,
        line_channel_access_token: true,
        is_active: true,
        order_service_active: true,
        store_name: true,
      },
    });

    if (!merchant) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Merchant not found',
      });
    }

    // 檢查是否可以使用服務：營業中或訂餐服務開啟
    if (!merchant.is_active && !merchant.order_service_active) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Service not available',
      });
    }

    // 交換 access token（使用商家的 channel secret）
    const tokenResponse: any = await $fetch(
      'https://api.line.me/oauth2/v2.1/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code as string,
          redirect_uri: `${config.public.lineRedirectUri}/api/customer/auth/callback`,
          client_id: merchant.line_channel_id || '',
          client_secret: merchant.line_channel_secret || '',
        }),
      }
    );

    // 取得用戶資料
    const userProfile: any = await $fetch('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    });

    // 建立顧客 session 資料（不儲存到資料庫）
    const customerSession = {
      merchantId: merchant.id,
      merchantLineId: merchantId,
      lineId: userProfile.userId,
      name: userProfile.displayName,
      type: 'customer',
      // 儲存商家的 channel access token 用於發送訊息
      merchantChannelAccessToken: merchant.line_channel_access_token,
    };

    // 生成顧客 JWT token
    const token = jwt.sign(customerSession, config.jwtSecret, {
      expiresIn: '30d',
    });

    // 設定顧客 JWT cookie（移除 httpOnly 以允許客戶端讀取）
    setCookie(event, 'customer-auth-token', token, {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 天
      sameSite: 'lax',
    });

    // 導向到店家的點餐頁面
    await sendRedirect(event, `/menu/${merchantId}`);
  } catch (error) {
    console.error('Customer LINE auth error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Customer authentication failed',
    });
  }
});
