<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full">
      <!-- 載入狀態 -->
      <div v-if="isLoading" class="text-center">
        <div class="bg-white rounded-xl p-8 shadow-lg">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"
          ></div>
          <p class="text-gray-600">載入中...</p>
        </div>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="error" class="text-center">
        <div class="bg-white rounded-xl p-8 shadow-lg">
          <div
            class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">載入失敗</h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <button
            @click="retryLoad"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            重試
          </button>
        </div>
      </div>

      <!-- 正常登入介面 -->
      <div v-else class="text-center">
        <!-- 店家資訊 -->
        <div class="bg-white rounded-xl p-8 shadow-lg mb-6">
          <div class="mb-6">
            <div
              class="w-20 h-20 bg-gradient-to-br from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl font-bold text-white">
                {{ getStoreInitial(merchantInfo.store_name) }}
              </span>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              {{ merchantInfo.store_name || '歡迎光臨' }}
            </h1>
          </div>

          <!-- 營業狀態 -->
          <div class="mb-6">
            <div
              v-if="merchantInfo.is_active"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
            >
              <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              營業中
            </div>
            <div
              v-else-if="!merchantInfo.is_active && merchantInfo.order_service_active"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
            >
              <div class="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              休息中 (可預訂)
            </div>
            <div
              v-else
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
            >
              <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              已關閉
            </div>
          </div>

          <!-- 登入提示 -->
          <div class="text-center">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">
              使用 LINE 登入點餐
            </h2>
            <p class="text-gray-600 text-sm mb-6">
              透過 LINE 登入後即可開始點餐
            </p>

            <!-- LINE 登入按鈕 -->
            <button
              @click="loginWithLine"
              :disabled="
                !merchantInfo.is_active && !merchantInfo.order_service_active
              "
              :class="{
                'bg-green-500 hover:bg-green-600':
                  merchantInfo.is_active || merchantInfo.order_service_active,
                'bg-gray-400 cursor-not-allowed':
                  !merchantInfo.is_active && !merchantInfo.order_service_active,
              }"
              class="w-full py-4 px-6 text-white font-bold rounded-lg text-base transition-colors flex items-center justify-center space-x-3"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                />
              </svg>
              <span>使用 LINE 登入</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const merchantId = route.params.merchantId;

const isLoading = ref(true);
const error = ref('');
const merchantInfo = ref({});

// 載入商家資訊
const loadMerchantInfo = async () => {
  try {
    isLoading.value = true;
    error.value = '';

    const {data} = await $fetch(`/api/customer/merchant/${merchantId}`);
    merchantInfo.value = data;
  } catch (err) {
    console.error('Failed to load merchant info:', err);
    error.value = '無法載入店家資訊，請稍後再試';
  } finally {
    isLoading.value = false;
  }
};

// 重試載入
const retryLoad = () => {
  loadMerchantInfo();
};

// 取得店家名稱首字母
const getStoreInitial = (storeName) => {
  if (!storeName) return '店';
  return storeName.charAt(0).toUpperCase();
};

// LINE 登入
const loginWithLine = () => {
  // 導向店家專屬的 LINE 登入
  window.location.href = `/api/customer/auth/line/${merchantId}`;
};

// 即時更新商家營業狀態
const updateMerchantActiveStatus = async () => {
  try {
    // 檢查是否為新的一天，如果是則重置手動控制標記
    await resetManualOverrideIfNeeded();

    // 如果商家設定了手動控制，則不進行自動狀態更新
    if (merchantInfo.value.manual_override_until_midnight === 1) {
      console.log('Manual override is active, skipping auto status update for customer login');
      return;
    }

    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // 檢查今日是否為休假日
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isHoliday = merchantInfo.value.special_hours?.some(special => {
      const specialDate = new Date(special.date);
      specialDate.setHours(0, 0, 0, 0);
      return specialDate.getTime() === today.getTime() && !special.is_open;
    });

    // 如果是休假日，設為關閉
    if (isHoliday) {
      if (merchantInfo.value.is_active !== 0) {
        await $fetch('/api/merchant/update-active-status', {
          method: 'POST',
          body: { 
            merchantId: merchantId,
            is_active: 0 
          }
        });
        merchantInfo.value.is_active = 0;
      }
      return;
    }

    // 檢查當前時間是否在營業時間內
    const businessHour = merchantInfo.value.business_hours?.find(bh => bh.day_of_week === currentDay);
    let shouldBeActive = false;

    if (businessHour && businessHour.is_open && businessHour.open_time && businessHour.close_time) {
      // 解析營業時間
      const parseTime = (timeStr) => {
        const parts = timeStr.split(':');
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
      };

      const openTimeInMinutes = parseTime(businessHour.open_time);
      const closeTimeInMinutes = parseTime(businessHour.close_time);

      // 檢查是否跨夜營業
      if (closeTimeInMinutes <= openTimeInMinutes) {
        // 跨夜營業
        if (closeTimeInMinutes === 0) {
          // 營業到午夜
          shouldBeActive = currentTimeInMinutes >= openTimeInMinutes;
        } else {
          // 跨夜但不到午夜
          shouldBeActive = currentTimeInMinutes >= openTimeInMinutes || currentTimeInMinutes <= closeTimeInMinutes;
        }
      } else {
        // 一般營業時間
        shouldBeActive = currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;
      }
    }

    // 更新狀態（如果有變化）
    const newActiveStatus = shouldBeActive ? 1 : 0;
    if (merchantInfo.value.is_active !== newActiveStatus) {
      await $fetch('/api/merchant/update-active-status', {
        method: 'POST',
        body: { 
          merchantId: merchantId,
          is_active: newActiveStatus 
        }
      });
      merchantInfo.value.is_active = newActiveStatus;
    }
  } catch (error) {
    console.error('Failed to update merchant active status:', error);
  }
};

// 檢查是否需要重置手動控制標記（新的一天）
const resetManualOverrideIfNeeded = async () => {
  try {
    const response = await $fetch('/api/merchant/reset-manual-override-customer', {
      method: 'POST',
      body: { merchantId: merchantId }
    });
    
    // 無論是否重置，都要重新載入商家資訊以獲取最新的手動控制狀態
    const { data } = await $fetch(`/api/customer/merchant/${merchantId}`);
    merchantInfo.value.manual_override_until_midnight = data.manual_override_until_midnight;
    
    if (response.reset) {
      console.log('Manual override was reset for new day');
    }
  } catch (error) {
    console.error('Failed to reset manual override for customer:', error);
  }
};

// 頁面載入時取得商家資訊
onMounted(async () => {
  await loadMerchantInfo();
  // 載入完成後檢查並更新營業狀態
  if (merchantInfo.value.business_hours) {
    await updateMerchantActiveStatus();
  }
});

// SEO
useHead({
  title: computed(() =>
    merchantInfo.value.store_name
      ? `thankQ線上點餐 - ${merchantInfo.value.store_name}`
      : 'thankQ線上點餐'
  ),
  meta: [
    {
      name: 'description',
      content: computed(
        () => merchantInfo.value.store_description || '使用 LINE 登入開始點餐'
      ),
    },
  ],
});
</script>
