export default defineNuxtRouteMiddleware((to) => {
  // 在客戶端 hydration 完成前不執行重定向
  if (process.client && !window.__NUXT_HYDRATED__) {
    return;
  }

  // 取得 customer-auth-token cookie
  const customerToken = useCookie('customer-auth-token', {
    default: () => null,
  });
  
  // 如果沒有 token，重定向到登入頁
  if (!customerToken.value) {
    const merchantId = to.params.merchantId;
    if (merchantId) {
      return navigateTo(`/menu/${merchantId}/login`);
    }
    // 如果無法取得 merchantId，重定向到首頁
    return navigateTo('/');
  }

  try {
    // 添加調試信息
    console.log('Customer auth debug:', {
      hasToken: !!customerToken.value,
      tokenLength: customerToken.value?.length,
      merchantId: to.params.merchantId,
      path: to.path,
      tokenPreview: customerToken.value?.substring(0, 50) + '...',
      tokenType: typeof customerToken.value
    });

    // 驗證 token 格式和內容
    if (!isValidCustomerToken(customerToken.value, to.params.merchantId)) {
      throw new Error('Invalid token');
    }
  } catch (error) {
    console.error('Customer auth error:', error);
    
    // 嘗試從無效 token 中提取 merchantId 用於重定向
    let merchantIdForRedirect = to.params.merchantId;
    
    if (!merchantIdForRedirect && customerToken.value) {
      try {
        const tokenParts = customerToken.value.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          merchantIdForRedirect = payload.merchantLineId;
        }
      } catch (e) {
        // 忽略解析錯誤
      }
    }
    
    // 清除無效的 token
    customerToken.value = null;
    
    // 重定向到登入頁
    if (merchantIdForRedirect) {
      return navigateTo(`/menu/${merchantIdForRedirect}/login`);
    }
    return navigateTo('/');
  }
});

// 驗證客戶 token 是否有效
function isValidCustomerToken(token: string, merchantId?: string): boolean {
  try {
    if (!token || typeof token !== 'string') {
      console.log('Token validation failed: no token or invalid type');
      return false;
    }

    // 檢查 JWT 格式
    const parts = token.split('.');
    console.log('Token parts:', { count: parts.length, parts: parts.map(p => p.substring(0, 20) + '...') });
    if (parts.length !== 3) {
      console.log('Token validation failed: invalid JWT format');
      return false;
    }

    // 解析 payload
    console.log('Attempting to decode payload:', parts[1].substring(0, 50) + '...');
    console.log('Full payload string:', parts[1]);
    
    // 修正 base64 padding
    let payloadString = parts[1];
    while (payloadString.length % 4) {
      payloadString += '=';
    }
    
    let payload;
    try {
      const decodedPayload = atob(payloadString);
      console.log('Decoded payload string:', decodedPayload);
      payload = JSON.parse(decodedPayload);
      console.log('Token payload:', payload);
    } catch (decodeError) {
      console.log('Base64 decode error:', decodeError);
      
      // 嘗試使用 Buffer 解碼（Node.js 環境）
      if (typeof Buffer !== 'undefined') {
        try {
          const decodedPayload = Buffer.from(payloadString, 'base64').toString('utf8');
          console.log('Buffer decoded payload:', decodedPayload);
          payload = JSON.parse(decodedPayload);
          console.log('Token payload (Buffer method):', payload);
        } catch (bufferError) {
          console.log('Buffer decode error:', bufferError);
          throw decodeError;
        }
      } else {
        throw decodeError;
      }
    }
    
    // 檢查是否過期
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      console.log('Token validation failed: expired', { exp: payload.exp, now: currentTime });
      return false;
    }

    // 檢查 token 類型
    if (payload.type !== 'customer') {
      console.log('Token validation failed: invalid type', { type: payload.type });
      return false;
    }

    // 檢查 merchantId 是否匹配（如果提供）
    if (merchantId && payload.merchantLineId !== merchantId) {
      console.log('Token validation failed: merchant ID mismatch', { 
        expected: merchantId, 
        actual: payload.merchantLineId 
      });
      return false;
    }

    // 檢查是否有 merchantLineId
    if (!payload.merchantLineId) {
      console.log('Token validation failed: no merchantLineId');
      return false;
    }

    console.log('Token validation passed');
    return true;
  } catch (error) {
    console.log('Token validation failed: parse error', error);
    return false;
  }
}