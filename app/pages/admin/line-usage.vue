<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between">
          <button
            @click="goBack"
            class="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>返回</span>
          </button>
          <h1 class="text-xl font-bold text-gray-900">LINE 訊息使用說明</h1>
          <div class="w-16"></div>
          <!-- 佔位符保持置中 -->
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 py-6">
      <!-- 重要提醒卡片 -->
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <div class="flex items-start space-x-3">
          <svg
            class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <h2 class="text-lg font-bold text-red-800 mb-2">⚠️ 重要提醒</h2>
            <p class="text-red-700 text-sm leading-relaxed">
              每筆成功的訂單都會消耗您的 LINE
              訊息發送額度。當額度用完時，系統將無法發送訂單確認訊息給顧客，這可能會影響您的營業。
            </p>
          </div>
        </div>
      </div>

      <!-- 使用量說明 -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
      >
        <div class="flex items-center space-x-3 mb-4">
          <div
            class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">訊息消耗說明</h2>
            <p class="text-sm text-gray-500">了解系統如何使用 LINE 訊息額度</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div
              class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <span class="text-green-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-1">
                每筆訂單 = 1 則訊息
              </h3>
              <p class="text-sm text-gray-600">
                當顧客完成訂餐後，系統會自動發送 1 則 LINE
                訊息給顧客，包含訂單詳細資訊
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div
              class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <span class="text-blue-600 font-bold text-sm">2</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-1">目前累積使用</h3>
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-2xl font-bold text-blue-600">{{
                  totalOrders
                }}</span>
                <span class="text-sm text-gray-600">則訊息已發送</span>
              </div>
              <p class="text-sm text-gray-600">
                這是您透過 thankQ 系統累積發送的訊息數量
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- LINE 方案說明 -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
      >
        <div class="flex items-center space-x-3 mb-4">
          <div
            class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">
              LINE 官方帳號方案
            </h2>
            <p class="text-sm text-gray-500">不同方案的訊息額度說明</p>
            <p class="text-xs text-blue-500">
              實際用量及資費方案以line官網為準
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 輕用量方案 -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="text-center mb-3">
              <h3 class="font-medium text-gray-900">輕用量方案</h3>
              <p class="text-sm text-gray-500">Light Plan</p>
            </div>
            <div class="text-center mb-3">
              <div class="text-2xl font-bold text-green-600">200</div>
              <div class="text-xs text-gray-500">則/月 免費</div>
            </div>
            <div class="text-xs text-gray-600 text-center">
              適合剛開始營業的店家
            </div>
          </div>

          <!-- 中用量方案 -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="text-center mb-3">
              <h3 class="font-medium text-blue-900">中用量方案</h3>
              <p class="text-sm text-blue-600">Standard Plan</p>
            </div>
            <div class="text-center mb-3">
              <div class="text-2xl font-bold text-blue-600">3,000</div>
              <div class="text-xs text-blue-600">則/月 $800</div>
            </div>
            <div class="text-xs text-blue-700 text-center">
              適合穩定營業的店家
            </div>
          </div>

          <!-- 高用量方案 -->
          <div class="border border-purple-200 rounded-lg p-4">
            <div class="text-center mb-3">
              <h3 class="font-medium text-gray-900">高用量方案</h3>
              <p class="text-sm text-gray-500">Premium Plan</p>
            </div>
            <div class="text-center mb-3">
              <div class="text-2xl font-bold text-purple-600">6,000</div>
              <div class="text-xs text-gray-500">則/月 $1200</div>
            </div>
            <div class="text-xs text-gray-600 text-center">
              適合高營業額的店家
            </div>
          </div>
        </div>
      </div>

      <!-- 管理建議 -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
      >
        <div class="flex items-center space-x-3 mb-4">
          <div
            class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">管理建議</h2>
            <p class="text-sm text-gray-500">如何有效管理 LINE 訊息額度</p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-start space-x-3">
            <div class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <p class="text-sm text-gray-700">
              <strong>監控使用量：</strong>定期檢查您的 LINE Business Manager
              帳務專區
            </p>
          </div>

          <div class="flex items-start space-x-3">
            <div class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <p class="text-sm text-gray-700">
              <strong>提前升級：</strong
              >當訂單量成長時，建議提前升級到適合的方案
            </p>
          </div>

          <div class="flex items-start space-x-3">
            <div class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <p class="text-sm text-gray-700">
              <strong>避免中斷：</strong
              >超過額度後顧客將收不到訂單確認，影響服務品質
            </p>
          </div>
        </div>
      </div>

      <!-- LINE Business Manager 連結 -->
      <div
        class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white"
      >
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold">LINE Business Manager</h3>
            <p class="text-green-100 text-sm">管理您的 LINE 官方帳號設定</p>
          </div>
          <svg
            class="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.630-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
            />
          </svg>
        </div>

        <div class="space-y-3">
          <p class="text-green-100 text-sm">
            在 LINE Business Manager 中您可以：
          </p>
          <ul class="text-green-100 text-sm space-y-1 ml-4">
            <li>• 查看當前訊息使用量</li>
            <li>• 升級或變更方案</li>
            <li>• 檢視帳務明細</li>
            <li>• 管理推廣方案</li>
          </ul>
          <a
            href="https://manager.line.biz/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 transition-colors"
          >
            <span>前往 LINE Business Manager</span>
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const totalOrders = ref(0);

// 載入訂單統計
const loadOrderStats = async () => {
  try {
    const {data} = await $fetch('/api/merchant/order-statistics');
    totalOrders.value = data.totalOrders || 0;
  } catch (error) {
    console.error('Failed to load order statistics:', error);
    totalOrders.value = 0;
  }
};

const goBack = () => {
  navigateTo('/admin/dashboard');
};

onMounted(() => {
  loadOrderStats();
});

useHead({
  title: 'LINE 訊息使用說明 - thankQ',
  meta: [
    {
      name: 'description',
      content: 'LINE 官方帳號訊息使用量說明與管理建議',
    },
  ],
});
</script>
