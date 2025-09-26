import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const merchantId = getRouterParam(event, 'merchantId');

  if (!merchantId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Merchant ID is required',
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
        is_active: true,
        order_service_active: true,
      },
    });

    if (!merchant) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Merchant not found',
      });
    }

    // 檢查是否可以登入：營業中或訂餐服務開啟
    if (!merchant.is_active && !merchant.order_service_active) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Service not available',
      });
    }

    if (!merchant.line_channel_id || !merchant.line_channel_secret) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Merchant LINE channel not configured',
      });
    }

    // 生成隨機的 state 參數來防止 CSRF 攻擊
    const state = generateRandomString(32);

    // 設定 state 到 cookie，包含商家 ID
    setCookie(event, 'customer_oauth_state', `${state}:${merchantId}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 10, // 10 分鐘
    });

    // 建立 LINE 登入 URL（使用商家的 channel ID）
    const lineAuthUrl = new URL('https://access.line.me/oauth2/v2.1/authorize');
    lineAuthUrl.searchParams.set('response_type', 'code');
    lineAuthUrl.searchParams.set('client_id', merchant.line_channel_id);
    const redirectUri = `${config.public.lineRedirectUri}/api/customer/auth/callback`;
    console.log('Customer redirect URI:', redirectUri);
    lineAuthUrl.searchParams.set('redirect_uri', redirectUri);
    lineAuthUrl.searchParams.set('state', state);
    lineAuthUrl.searchParams.set('scope', 'profile openid');

    // 重定向到 LINE 登入頁面
    await sendRedirect(event, lineAuthUrl.toString());
  } catch (error) {
    console.error('Customer LINE auth error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Authentication initialization failed',
    });
  }
});

function generateRandomString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
