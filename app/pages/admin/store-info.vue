<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-4 py-4">
        <div class="flex items-center space-x-3">
          <button
            @click="goBack"
            class="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors"
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
          </button>
          <div>
            <h1 class="text-lg font-semibold text-gray-900">店家資訊</h1>
            <p class="text-sm text-gray-500">查看與編輯店家基本資訊</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 py-6">
      <form @submit.prevent="saveStoreInfo" class="space-y-6">
        <!-- 基本資訊區塊 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">基本資訊</h2>
                <p class="text-sm text-gray-500">設定店家的基本資訊</p>
              </div>
            </div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 登入帳號 -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  登入帳號
                </label>
                <div class="flex space-x-2">
                  <input
                    v-model="storeInfo.username"
                    type="text"
                    readonly
                    class="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                  <button
                    type="button"
                    @click="goToResetPassword"
                    class="px-4 py-2 bg-orange-400 hover:bg-red-500 text-white rounded-md text-sm transition-colors whitespace-nowrap"
                  >
                    重設密碼
                  </button>
                </div>
                <p class="text-xs text-gray-500">
                  登入帳號無法修改，如需更改請聯繫管理員
                </p>
              </div>
              <!-- 店家名稱 -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  店家名稱 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="storeInfo.store_name"
                  type="text"
                  placeholder="請輸入店家名稱"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  :class="{'border-red-500': errors.store_name}"
                  @input="errors.store_name = ''"
                />
                <p v-if="errors.store_name" class="text-red-500 text-xs">
                  {{ errors.store_name }}
                </p>
              </div>

              <!-- 聯絡電話 -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  聯絡電話 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="storeInfo.phone"
                  type="tel"
                  placeholder="請輸入聯絡電話"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  :class="{'border-red-500': errors.phone}"
                  @input="errors.phone = ''"
                />
                <p v-if="errors.phone" class="text-red-500 text-xs">
                  {{ errors.phone }}
                </p>
              </div>

              <!-- Email 信箱 -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Email 信箱 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="storeInfo.email"
                  type="email"
                  placeholder="請輸入 Email 信箱"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  :class="{'border-red-500': errors.email}"
                  @input="errors.email = ''"
                />
                <p v-if="errors.email" class="text-red-500 text-xs">
                  {{ errors.email }}
                </p>
              </div>

              <!-- 店家地址 -->
              <div class="space-y-2 md:col-span-2">
                <label class="block text-sm font-medium text-gray-700">
                  店家地址 <span class="text-red-500">*</span>
                </label>
                <div class="space-y-2">
                  <div class="flex space-x-2">
                    <input
                      v-model="storeInfo.address"
                      type="text"
                      placeholder="請輸入店家地址"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      :class="{
                        'border-red-500': errors.address,
                        'border-green-500': addressVerified && !errors.address,
                      }"
                      @input="resetAddressVerification"
                      @focus="errors.address = ''"
                    />
                    <button
                      type="button"
                      @click="verifyAddress"
                      :disabled="!storeInfo.address || isVerifyingAddress"
                      class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      <span v-if="isVerifyingAddress">驗證中...</span>
                      <span v-else>驗證地址</span>
                    </button>
                  </div>

                  <!-- 地址驗證結果 -->
                  <div
                    v-if="addressVerified"
                    class="text-sm text-green-600 flex items-center"
                  >
                    <svg
                      class="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    地址驗證成功
                  </div>

                  <!-- 錯誤訊息 -->
                  <div v-if="errors.address" class="text-red-500 text-xs">
                    {{ errors.address }}
                  </div>

                  <!-- 地址格式提示 -->
                  <div class="text-xs text-gray-500">
                    請輸入完整地址，包含縣市、區域、路名門牌號碼
                  </div>
                </div>
              </div>

              <!-- 收款帳號 -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  收款帳號 <span class="text-gray-500">(選填)</span>
                </label>
                <input
                  v-model="storeInfo.bank_account"
                  type="text"
                  placeholder="例如：國泰世華(013) 1234567890123"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  :class="{'border-red-500': errors.bank_account}"
                  @input="errors.bank_account = ''"
                />
                <p v-if="errors.bank_account" class="text-red-500 text-xs">
                  {{ errors.bank_account }}
                </p>
                <p class="text-xs text-gray-500">
                  用於銀行轉帳付款時顯示給顾客，格式：(代碼) 帳號
                </p>
              </div>

              <!-- 店家簡介 -->
              <div class="space-y-2 md:col-span-2">
                <label class="block text-sm font-medium text-gray-700">
                  店家簡介
                </label>
                <textarea
                  v-model="storeInfo.store_description"
                  rows="4"
                  placeholder="請輸入店家簡介與特色、營業時間等資訊"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  :class="{'border-red-500': errors.store_description}"
                  @input="errors.store_description = ''"
                ></textarea>
                <p v-if="errors.store_description" class="text-red-500 text-xs">
                  {{ errors.store_description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按鈕 -->
        <div class="sticky bottom-0 bg-gray-50 pt-4 pb-6">
          <div class="flex space-x-3">
            <button
              type="button"
              @click="goBack"
              class="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              取消
            </button>

            <button
              type="submit"
              :disabled="
                isSubmitting || (storeInfo.address && !addressVerified)
              "
              class="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg text-sm transition-colors duration-200 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting">儲存中...</span>
              <span v-else-if="storeInfo.address && !addressVerified"
                >請先驗證地址</span
              >
              <span v-else>儲存變更</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const storeInfo = ref({
  store_name: '',
  phone: '',
  email: '',
  address: '',
  store_description: '',
  bank_account: '',
  username: '',
});

const errors = ref({
  store_name: '',
  phone: '',
  email: '',
  address: '',
  store_description: '',
  bank_account: '',
});

const isSubmitting = ref(false);
const isVerifyingAddress = ref(false);
const addressVerified = ref(false);
const originalAddress = ref('');

// 載入店家資訊
const loadStoreInfo = async () => {
  try {
    const {data} = await $fetch('/api/merchant/info');
    storeInfo.value = {
      store_name: data.store_name || '',
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      store_description: data.store_description || '',
      bank_account: data.bank_account || '',
      username: data.username || '',
    };
    // 記錄原始地址，如果地址沒有改變則視為已驗證
    originalAddress.value = data.address || '';
    addressVerified.value = !!data.address;
  } catch (error) {
    console.error('Failed to load store info:', error);
  }
};

// 地址格式驗證
const validateAddress = (address) => {
  const taiwanAddressPattern =
    /^(台北市|新北市|桃園市|台中市|台南市|高雄市|基隆市|新竹市|嘉義市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義縣|屏東縣|宜蘭縣|花蓮縣|台東縣|澎湖縣|金門縣|連江縣).+(區|鄉|鎮|市).+(路|街|巷|弄|號|村|里).+\d+/;
  return taiwanAddressPattern.test(address);
};

// 重置地址驗證狀態
const resetAddressVerification = () => {
  // 如果地址與原始地址相同，則保持驗證狀態
  if (storeInfo.value.address === originalAddress.value) {
    addressVerified.value = !!originalAddress.value;
  } else {
    addressVerified.value = false;
  }
  errors.value.address = '';
};

// 驗證地址
const verifyAddress = async () => {
  if (!storeInfo.value.address) {
    errors.value.address = '請先輸入店家地址';
    return;
  }

  // 先檢查地址格式
  if (!validateAddress(storeInfo.value.address)) {
    errors.value.address =
      '請輸入正確的台灣地址格式（包含縣市、區域、路名、門牌號碼）';
    return;
  }

  isVerifyingAddress.value = true;
  errors.value.address = '';

  try {
    // 使用距離計算API驗證地址
    const response = await $fetch(
      'https://n8n.cheeyun.us.kg/webhook/8751dc26-4bfa-4565-8583-d7ffd62c649e',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_address: storeInfo.value.address,
          store_address: '台北市信義區信義路五段7號', // 使用一個已知的地址作為參考點
        }),
      }
    );

    if (response.status === 'Ok' && response.distance) {
      addressVerified.value = true;
      errors.value.address = '';
    } else {
      errors.value.address = '地址驗證失敗，請檢查地址是否正確';
    }
  } catch (error) {
    console.error('地址驗證失敗:', error);
    errors.value.address = '地址驗證失敗，請檢查地址是否正確或稍後再試';
  } finally {
    isVerifyingAddress.value = false;
  }
};

// 驗證表單
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!storeInfo.value.store_name.trim()) {
    errors.value.store_name = '請輸入店家名稱';
    isValid = false;
  }

  if (
    !storeInfo.value.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeInfo.value.email)
  ) {
    errors.value.email = 'Email 格式不正確';
    isValid = false;
  }

  if (
    !storeInfo.value.phone.trim() &&
    !/^[\d\-\+\(\)\s]+$/.test(storeInfo.value.phone)
  ) {
    errors.value.phone = '電話號碼格式不正確';
    isValid = false;
  }
  if (!storeInfo.value.address.trim()) {
    errors.value.address = '請輸入地址';
    isValid = false;
  } else if (!addressVerified.value) {
    errors.value.address = '請先驗證店家地址';
    isValid = false;
  }

  return isValid;
};

// 儲存店家資訊
const saveStoreInfo = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    await $fetch('/api/merchant/setup', {
      method: 'POST',
      body: storeInfo.value,
    });

    alert('店家資訊已更新');
  } catch (error) {
    console.error('Save store info failed:', error);
    alert('儲存失敗，請檢查輸入的資訊');
  } finally {
    isSubmitting.value = false;
  }
};

// 返回按鈕
const goBack = () => {
  navigateTo('/admin/dashboard');
};

// 導航到重置密碼頁面
const goToResetPassword = () => {
  navigateTo('/admin/reset-password');
};

useHead({
  title: computed(() =>
    storeInfo.value.store_name
      ? `店家資訊 -${storeInfo.value.store_name}`
      : '店家資訊'
  ),
  meta: [
    {
      name: 'description',
      content: computed(() => storeInfo.value.store_description || '店家資訊'),
    },
  ],
});

// 頁面載入時取得資訊
onMounted(() => {
  loadStoreInfo();
});
</script>
