import jwt from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const {code, state} = query;

  // 驗證 state 參數
  const savedState = getCookie(event, 'oauth_state');
  if (!state || state !== savedState) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid state parameter',
    });
  }

  // 清除 state cookie
  deleteCookie(event, 'oauth_state');

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Authorization code not provided',
    });
  }

  try {
    // 交換 access token
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
          redirect_uri: `${config.public.lineRedirectUri}/api/auth/callback`,
          client_id: config.public.lineChannelId,
          client_secret: config.lineChannelSecret,
        }),
      }
    );

    const getTaipeiTime = () => {
      return new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
    };

    // 取得用戶資料
    const userProfile: any = await $fetch('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    });

    // 檢查或建立商家帳戶
    let merchant = await prisma.merchant.findUnique({
      where: {lineId: userProfile.userId},
    });

    if (!merchant) {
      // 建立新商家帳戶
      merchant = await prisma.merchant.create({
        data: {
          name: userProfile.displayName,
          lineId: userProfile.userId,
          subscriptionStatus: false,
          createdAt: getTaipeiTime(),
          updatedAt: getTaipeiTime(),
        },
      });
    }

    // 生成 JWT token
    const token = jwt.sign(
      {
        merchantId: merchant.id,
        lineId: merchant.lineId,
        name: merchant.name,
      },
      config.jwtSecret,
      {expiresIn: '7d'}
    );

    // 設定 JWT cookie
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 天
      sameSite: 'lax',
    });

    // 檢查商家是否已完成基本設定
    const isSetupComplete = merchant.store_name && merchant.phone && merchant.email;
    
    if (!isSetupComplete) {
      // 基本設定未完成，導向 setup 頁面
      await sendRedirect(event, '/admin/setup');
    } else {
      // 基本設定完成，導向 dashboard
      await sendRedirect(event, '/admin/dashboard');
    }
  } catch (error) {
    console.error('LINE auth error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Authentication failed',
    });
  }
});
