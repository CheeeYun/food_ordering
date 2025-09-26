export default defineNuxtRouteMiddleware((to, from) => {
  // 只在 admin 路徑下檢查認證
  if (!to.path.startsWith('/admin')) {
    return;
  }

  // 跳過登入和註冊頁面
  if (to.path === '/admin/login' || to.path === '/admin/setup') {
    return;
  }

  // 在客戶端 hydration 完成前不執行重定向
  if (process.client && !window.__NUXT_HYDRATED__) {
    return;
  }

  try {
    // 使用 Nuxt 的 useCookie 來讀取 cookie
    const token = useCookie('auth-token', {
      default: () => null,
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    }).value;

    if (!token) {
      return navigateTo('/admin/login');
    }

    // 驗證 token 格式和過期時間
    if (!isValidToken(token)) {
      // 清除無效的 token
      const authCookie = useCookie('auth-token');
      authCookie.value = null;
      return navigateTo('/admin/login');
    }
  } catch (error) {
    // 處理可能的錯誤
    console.error('Auth middleware error:', error);
    return navigateTo('/admin/login');
  }
});

// 驗證 token 是否有效
function isValidToken(token: string): boolean {
  try {
    if (!token || typeof token !== 'string') {
      return false;
    }

    // 檢查 JWT 格式
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // 檢查是否過期
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
