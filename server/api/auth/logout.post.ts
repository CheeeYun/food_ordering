export default defineEventHandler(async (event) => {
  try {
    // 清除 auth-token cookie
    deleteCookie(event, 'auth-token');
    
    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    console.error('Logout error:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Logout failed',
    });
  }
});