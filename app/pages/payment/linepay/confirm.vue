<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <!-- 處理中狀態 -->
      <div v-if="isProcessing" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">處理付款中</h2>
        <p class="text-gray-600">請稍候，正在確認您的付款...</p>
      </div>

      <!-- 付款成功 -->
      <div v-else-if="paymentSuccess" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">付款成功！</h2>
        <p class="text-gray-600 mb-6">您的訂單已成功建立，商家將盡快為您準備餐點。</p>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div class="text-sm text-gray-600 space-y-2">
            <div class="flex justify-between">
              <span>訂單編號：</span>
              <span class="font-mono">{{ orderId }}</span>
            </div>
            <div class="flex justify-between">
              <span>付款金額：</span>
              <span class="font-semibold text-green-600">${{ amount }}</span>
            </div>
          </div>
        </div>

        <button
          @click="goToMenu"
          class="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
        >
          繼續點餐
        </button>
      </div>

      <!-- 付款失敗 -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">付款失敗</h2>
        <p class="text-gray-600 mb-6">{{ errorMessage || '付款過程中發生錯誤，請重新嘗試。' }}</p>
        
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
const isProcessing = ref(true);
const paymentSuccess = ref(false);
const orderId = ref('');
const amount = ref(0);
const errorMessage = ref('');

// 從 URL 參數獲取資訊
const { orderId: orderIdParam, merchantId, transactionId } = route.query;

const goToMenu = () => {
  if (merchantId) {
    navigateTo(`/menu/${merchantId}`);
  } else {
    window.close();
  }
};

// 確認付款
const confirmPayment = async () => {
  try {
    if (!transactionId || !orderIdParam || !merchantId) {
      throw new Error('缺少必要的付款參數');
    }

    // 從 localStorage 獲取訂單資料以取得金額
    const orderData = localStorage.getItem(`order_${orderIdParam}`);
    let orderAmount = 0;
    if (orderData) {
      try {
        const parsedOrderData = JSON.parse(orderData);
        orderAmount = parsedOrderData.totalAmount;
      } catch (error) {
        console.error('解析訂單資料失敗:', error);
      }
    }

    const response = await $fetch('/api/payment/linepay/confirm', {
      method: 'POST',
      body: {
        transactionId,
        orderId: orderIdParam,
        merchantId,
        amount: orderAmount,
      },
    });

    if (response.success) {
      paymentSuccess.value = true;
      orderId.value = response.data.orderId;
      amount.value = response.data.amount;

      // 取得並發送儲存的訂單資料
      const orderData = localStorage.getItem(`order_${orderIdParam}`);
      if (orderData) {
        try {
          const parsedOrderData = JSON.parse(orderData);
          parsedOrderData.paymentStatus = 'paid';
          parsedOrderData.transactionId = response.data.transactionId;

          // 發送訂單到顧客的 LINE
          await $fetch('/api/customer/send-order', {
            method: 'POST',
            body: { orderData: parsedOrderData },
          });

          // 清除 localStorage 中的訂單資料
          localStorage.removeItem(`order_${orderIdParam}`);
        } catch (error) {
          console.error('發送訂單失敗:', error);
        }
      }
    }
  } catch (error) {
    console.error('付款確認失敗:', error);
    paymentSuccess.value = false;
    errorMessage.value = error.message || '付款確認失敗';
  } finally {
    isProcessing.value = false;
  }
};

// 頁面載入時確認付款
onMounted(() => {
  confirmPayment();
});

// SEO
useHead({
  title: 'LINE Pay 付款確認',
  meta: [
    {
      name: 'description',
      content: 'LINE Pay 付款確認頁面',
    },
  ],
});
</script>