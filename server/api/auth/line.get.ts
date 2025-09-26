export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // 生成隨機的 state 參數來防止 CSRF 攻擊
  const state = generateRandomString(32);

  // 設定 state 到 cookie
  setCookie(event, 'oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10, // 10 分鐘
  });

  // 建立 LINE 登入 URL
  const lineAuthUrl = new URL('https://access.line.me/oauth2/v2.1/authorize');
  lineAuthUrl.searchParams.set('response_type', 'code');
  lineAuthUrl.searchParams.set('client_id', config.public.lineChannelId);
  lineAuthUrl.searchParams.set('redirect_uri', `${config.public.lineRedirectUri}/api/auth/callback`);
  lineAuthUrl.searchParams.set('state', state);
  lineAuthUrl.searchParams.set('scope', 'profile openid');

  // 重定向到 LINE 登入頁面
  await sendRedirect(event, lineAuthUrl.toString());
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
