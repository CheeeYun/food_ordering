<template>
  <div class="fixed inset-0 bg-white flex items-center justify-center p-4 z-50">
    <div class="max-w-md w-full text-center">
      <!-- 成功圖示 -->
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <!-- 標題 -->
      <h2 class="text-2xl font-bold text-gray-900 mb-4">訂單成功！</h2>
      
      <!-- 訂單編號 -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <p class="text-sm text-gray-600 mb-2">您的訂單編號</p>
        <p class="text-xl font-mono font-bold text-blue-600">{{ orderNumber }}</p>
        <button
          @click="copyOrderNumber"
          class="mt-2 text-sm text-blue-500 hover:text-blue-600"
        >
          點擊複製
        </button>
      </div>

      <!-- 訂單摘要 -->
      <div class="text-left bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h3 class="font-medium text-gray-900 mb-3">訂單摘要</h3>
        
        <!-- 取餐資訊 -->
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">取餐方式：</span>
            <span>{{ getPickupTypeText() }}</span>
          </div>
          <div v-if="orderData.pickupInfo.type === 'scheduled'" class="flex justify-between">
            <span class="text-gray-600">預約時間：</span>
            <span>{{ orderData.pickupInfo.date }} {{ orderData.pickupInfo.time }}</span>
          </div>
          <div v-if="orderData.pickupInfo.type === 'immediate'" class="flex justify-between">
            <span class="text-gray-600">預計取餐時間：</span>
            <span>{{ orderData.pickupInfo.date }} {{ orderData.pickupInfo.time }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">用餐方式：</span>
            <span>{{ getDiningTypeText() }}</span>
          </div>
          <div v-if="orderData.diningType === 'dine-in' && orderData.tableNumber" class="flex justify-between">
            <span class="text-gray-600">桌號：</span>
            <span>{{ orderData.tableNumber }}</span>
          </div>
          <div v-if="orderData.diningType === 'delivery'" class="flex justify-between">
            <span class="text-gray-600">外送地址：</span>
            <span class="break-words">{{ orderData.deliveryAddress }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">支付方式：</span>
            <span>{{ getPaymentMethodText() }}</span>
          </div>
          <div v-if="orderData.deliveryFee && orderData.deliveryFee > 0" class="flex justify-between">
            <span class="text-gray-600">外送費：</span>
            <span>${{ orderData.deliveryFee }}</span>
          </div>
          <div class="flex justify-between border-t border-gray-200 pt-2 font-medium">
            <span>總金額：</span>
            <span class="text-blue-600">${{ orderData.totalAmount }}</span>
          </div>
        </div>
      </div>

      <!-- 提醒訊息 -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-left">
            <p class="text-sm font-medium text-blue-800">溫馨提醒</p>
            <p class="text-sm text-blue-700 mt-1">
              請保留您的訂單編號，並
              <span v-if="orderData.pickupInfo.type === 'immediate'">約15-20分鐘後</span>
              <span v-else>於預約時間</span>
              到店取餐。
            </p>
            <p v-if="orderData.customerInfo.phone" class="text-sm text-blue-700 mt-1">
              我們會透過手機 {{ formatPhone(orderData.customerInfo.phone) }} 聯絡您。
            </p>
          </div>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div class="space-y-3">
        <button
          @click="$emit('new-order')"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
        >
          繼續點餐
        </button>
        <button
          @click="$emit('close')"
          class="w-full text-gray-600 hover:text-gray-800 py-2 text-sm transition-colors"
        >
          關閉視窗
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  orderNumber: {
    type: String,
    required: true
  },
  orderData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'new-order']);

// 複製訂單編號
const copyOrderNumber = async () => {
  try {
    await navigator.clipboard.writeText(props.orderNumber);
    alert('訂單編號已複製到剪貼簿');
  } catch (error) {
    console.error('複製失敗:', error);
    // 備用方案：手動選擇文字
    const textArea = document.createElement('textarea');
    textArea.value = props.orderNumber;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('訂單編號已複製到剪貼簿');
  }
};

// 格式化電話號碼
const formatPhone = (phone) => {
  if (phone.length === 10) {
    return `${phone.slice(0, 4)}-${phone.slice(4, 7)}-${phone.slice(7)}`;
  }
  return phone;
};

// 取得取餐方式文字
const getPickupTypeText = () => {
  return props.orderData.pickupInfo.type === 'immediate' ? '立即取餐' : '預約取餐';
};

// 取得用餐方式文字
const getDiningTypeText = () => {
  const types = {
    takeaway: '外帶',
    'dine-in': '內用',
    delivery: '外送'
  };
  return types[props.orderData.diningType] || '未知';
};

// 取得支付方式文字
const getPaymentMethodText = () => {
  const methods = {
    cash: '現金付款',
    card: '刷卡付款',
    mobile: 'LINE Pay',
    bank_transfer: '銀行轉帳'
  };
  return methods[props.orderData.paymentMethod] || '未知';
};
</script>