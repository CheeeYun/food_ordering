<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">付款已取消</h2>
        <p class="text-gray-600 mb-6">您已取消付款，可以重新選擇其他付款方式。</p>
        
        <button
          @click="goToMenu"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
        >
          返回菜單
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
  middleware: 'customer-auth'
});

const route = useRoute();
const { merchantId, orderId } = route.query;

const goToMenu = () => {
  // 清除可能儲存的訂單資料
  if (orderId) {
    localStorage.removeItem(`order_${orderId}`);
  }
  
  if (merchantId) {
    navigateTo(`/menu/${merchantId}`);
  } else {
    window.close();
  }
};

// SEO
useHead({
  title: 'LINE Pay 付款取消',
  meta: [
    {
      name: 'description',
      content: 'LINE Pay 付款取消頁面',
    },
  ],
});
</script>