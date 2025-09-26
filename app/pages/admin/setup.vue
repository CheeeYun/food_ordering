<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-2xl mx-auto">
      <!-- 標題 -->
      <div class="text-center mb-8 pt-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">商家基本資料設定</h1>
        <p class="text-gray-600">請填寫商家基本資訊來完成設定</p>
      </div>
      <!-- 表單 -->
      <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <form @submit.prevent="submitSetup" class="space-y-6">
          <!-- 商店名稱 -->
          <div>
            <div class="flex items-center justify-end max-w-2xl mx-auto">
              <img src="/logoType.png" class="w-25" />
            </div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              商店名稱 *
            </label>
            <input
              v-model="form.store_name"
              type="text"
              required
              placeholder="例如：阿明牛肉麵"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              :class="{'border-red-500': errors.store_name}"
              @focus="errors.store_name = ''"
            />
            <p v-if="errors.store_name" class="text-red-500 text-sm mt-1">
              {{ errors.store_name }}
            </p>
          </div>

          <!-- 聯絡電話 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              聯絡電話 *
            </label>
            <input
              v-model="form.phone"
              type="tel"
              required
              placeholder="例如：0912345678"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              :class="{'border-red-500': errors.phone}"
              @focus="errors.phone = ''"
            />
            <p v-if="errors.phone" class="text-red-500 text-sm mt-1">
              {{ errors.phone }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              required
              v-model="form.email"
              type="email"
              placeholder="例如：shop@example.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              :class="{'border-red-500': errors.email}"
              @focus="errors.email = ''"
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">
              {{ errors.email }}
            </p>
          </div>

          <!-- 店家地址 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              店家地址 *
            </label>
            <div class="space-y-2">
              <div class="flex space-x-2">
                <input
                  v-model="form.address"
                  type="text"
                  required
                  placeholder="例如：台北市信義區信義路五段7號"
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
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
                  :disabled="!form.address || isVerifyingAddress"
                  class="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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
                ✓ 地址驗證成功
              </div>

              <!-- 錯誤訊息 -->
              <div v-if="errors.address" class="text-red-500 text-sm">
                {{ errors.address }}
              </div>

              <!-- 地址格式提示 -->
              <div class="text-xs text-gray-500">
                請輸入完整地址，包含縣市、區域、路名門牌號碼
              </div>
            </div>
          </div>

          <!-- 帳號設定 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              帳號設定
            </label>
            <div class="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
              <div class="flex items-center mb-2">
                <svg
                  class="w-5 h-5 text-blue-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
                <h3 class="text-sm font-semibold text-blue-800">
                  建立登入帳號
                </h3>
              </div>
              <p class="text-blue-700 text-sm mb-3">
                設定帳號密碼，可以登入後台管理訂單和菜單
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 帳號 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  登入帳號 *
                </label>
                <div class="space-y-2">
                  <div class="flex space-x-2">
                    <input
                      v-model="form.username"
                      type="text"
                      required
                      placeholder="例如：shop001"
                      class="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      :class="{
                        'border-red-500':
                          errors.username ||
                          (usernameChecked && !usernameAvailable),
                        'border-green-500':
                          usernameChecked &&
                          usernameAvailable &&
                          !errors.username,
                      }"
                      @input="resetUsernameCheck"
                      @focus="errors.username = ''"
                    />
                    <button
                      type="button"
                      @click="checkUsernameAvailability"
                      :disabled="!form.username || isCheckingUsername"
                      class="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      <span v-if="isCheckingUsername">檢查中...</span>
                      <span v-else>檢查帳號</span>
                    </button>
                  </div>

                  <!-- 檢查結果 -->
                  <div v-if="usernameChecked" class="text-sm flex items-center">
                    <svg
                      v-if="usernameAvailable"
                      class="w-4 h-4 mr-1 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4 mr-1 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span
                      :class="
                        usernameAvailable ? 'text-green-600' : 'text-red-600'
                      "
                    >
                      {{
                        usernameAvailable ? '✓ 帳號可以使用' : '此帳號已被使用'
                      }}
                    </span>
                  </div>

                  <!-- 錯誤訊息 -->
                  <div v-if="errors.username" class="text-red-500 text-sm">
                    {{ errors.username }}
                  </div>

                  <!-- 帳號格式提示 -->
                  <div class="text-xs text-gray-500">
                    英文字母和數字，建議6-20字元
                  </div>
                </div>
              </div>

              <!-- 密碼 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  登入密碼 *
                </label>
                <input
                  v-model="form.password"
                  type="password"
                  required
                  placeholder="請設定6位以上密碼"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  :class="{'border-red-500': errors.password}"
                  @focus="errors.password = ''"
                />
                <p v-if="errors.password" class="text-red-500 text-sm mt-1">
                  {{ errors.password }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  至少6個字元，建議包含英文和數字
                </p>
              </div>

              <!-- 確認密碼 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  確認密碼 *
                </label>
                <input
                  v-model="form.confirmPassword"
                  type="password"
                  required
                  placeholder="再次輸入密碼"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  :class="{'border-red-500': errors.confirmPassword}"
                  @focus="errors.confirmPassword = ''"
                />
                <p
                  v-if="errors.confirmPassword"
                  class="text-red-500 text-sm mt-1"
                >
                  {{ errors.confirmPassword }}
                </p>
              </div>
            </div>
          </div>

          <!-- 商店描述 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              商店描述
            </label>
            <textarea
              v-model="form.store_description"
              placeholder="簡單介紹您的商店特色、營業時間等..."
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-vertical focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              :class="{'border-red-500': errors.store_description}"
              @focus="errors.store_description = ''"
            ></textarea>
            <p
              v-if="errors.store_description"
              class="text-red-500 text-sm mt-1"
            >
              {{ errors.store_description }}
            </p>
          </div>

          <!-- 說明區塊 -->
          <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div class="flex items-center mb-2">
              <svg
                class="w-5 h-5 text-blue-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              <h3 class="text-base font-semibold text-blue-800">
                基本設定完成後
              </h3>
            </div>
            <p class="text-blue-700 text-sm">
              完成基本資料設定後，您可以在後台「設定」頁面中配置 LINE
              頻道資訊，讓顧客可以透過 LINE 登入點餐。
            </p>
          </div>

          <!-- 提交按鈕 -->
          <button
            type="submit"
            :disabled="isSubmitting || (form.address && !addressVerified)"
            class="w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold rounded-lg text-base transition-colors duration-200 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting">儲存中...</span>
            <span v-else-if="form.address && !addressVerified"
              >請先驗證地址</span
            >
            <span v-else>完成設定</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// definePageMeta({
//   middleware: 'auth'
// })

const form = ref({
  store_name: '',
  store_description: '',
  phone: '',
  email: '',
  address: '',
  username: '',
  password: '',
  confirmPassword: '',
});

const errors = ref({
  store_name: '',
  store_description: '',
  phone: '',
  email: '',
  address: '',
  username: '',
  password: '',
  confirmPassword: '',
});

const isSubmitting = ref(false);
const isVerifyingAddress = ref(false);
const addressVerified = ref(false);

// Username 檢查相關
const isCheckingUsername = ref(false);
const usernameChecked = ref(false);
const usernameAvailable = ref(false);

// 地址格式驗證
const validateAddress = (address) => {
  const taiwanAddressPattern =
    /^(台北市|新北市|桃園市|台中市|台南市|高雄市|基隆市|新竹市|嘉義市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義縣|屏東縣|宜蘭縣|花蓮縣|台東縣|澎湖縣|金門縣|連江縣).+(區|鄉|鎮|市).+(路|街|巷|弄|號|村|里).+\d+/;
  return taiwanAddressPattern.test(address);
};

// 重置地址驗證狀態
const resetAddressVerification = () => {
  addressVerified.value = false;
  errors.value.address = '';
};

// 驗證地址
const verifyAddress = async () => {
  if (!form.value.address) {
    errors.value.address = '請先輸入店家地址';
    return;
  }

  // 先檢查地址格式
  if (!validateAddress(form.value.address)) {
    errors.value.address =
      '請輸入正確的台灣地址格式（包含縣市、區域、路名、門牌號碼）';
    return;
  }

  isVerifyingAddress.value = true;
  errors.value.address = '';

  try {
    // 使用一個測試地址來驗證API是否可用
    const response = await $fetch(
      'https://n8n.cheeyun.us.kg/webhook/8751dc26-4bfa-4565-8583-d7ffd62c649e',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_address: form.value.address,
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

// 重置 username 檢查狀態
const resetUsernameCheck = () => {
  usernameChecked.value = false;
  usernameAvailable.value = false;
  errors.value.username = '';
};

// 檢查 username 是否可用
const checkUsernameAvailability = async () => {
  if (!form.value.username.trim()) {
    errors.value.username = '請先輸入帳號';
    return;
  }

  // 檢查格式
  if (!/^[a-zA-Z0-9]{3,20}$/.test(form.value.username)) {
    errors.value.username = '帳號只能包含英文字母和數字，長度3-20字元';
    return;
  }

  isCheckingUsername.value = true;
  errors.value.username = '';

  try {
    const response = await $fetch('/api/auth/check-username', {
      method: 'POST',
      body: {
        username: form.value.username.trim(),
      },
    });


    usernameChecked.value = true;
    usernameAvailable.value = response?.available || false;

    if (!response?.available) {
      // Username not available
    }
  } catch (error) {
    console.error('Check username failed:', error);
    errors.value.username = '檢查失敗，請稍後再試';
  } finally {
    isCheckingUsername.value = false;
  }
};

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  // 驗證商店名稱
  if (!form.value.store_name.trim()) {
    errors.value.store_name = '請輸入商店名稱';
    isValid = false;
  }

  // 驗證電話
  if (!form.value.phone.trim()) {
    errors.value.phone = '請輸入聯絡電話';
    isValid = false;
  } else if (!/^09\d{8}$/.test(form.value.phone.replace(/\s+/g, ''))) {
    errors.value.phone = '請輸入正確的台灣手機號碼格式';
    isValid = false;
  }

  // 驗證 Email（必填）
  if (!form.value.email.trim()) {
    errors.value.email = '請輸入 Email';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = '請輸入正確的 Email 格式';
    isValid = false;
  }

  // 驗證地址（必填且必須已驗證）
  if (!form.value.address.trim()) {
    errors.value.address = '請輸入店家地址';
    isValid = false;
  } else if (!addressVerified.value) {
    errors.value.address = '請先驗證店家地址';
    isValid = false;
  }

  // 驗證登入帳號
  if (!form.value.username.trim()) {
    errors.value.username = '請輸入登入帳號';
    isValid = false;
  } else if (!/^[a-zA-Z0-9]{3,20}$/.test(form.value.username)) {
    errors.value.username = '帳號只能包含英文字母和數字，長度3-20字元';
    isValid = false;
  } else if (!usernameChecked.value) {
    errors.value.username = '請先點擊「檢查帳號」按鈕檢查帳號是否可用';
    isValid = false;
  } else if (usernameChecked.value && !usernameAvailable.value) {
    errors.value.username = '此帳號已被使用，請更換帳號';
    isValid = false;
  }

  // 驗證登入密碼
  if (!form.value.password.trim()) {
    errors.value.password = '請輸入登入密碼';
    isValid = false;
  } else if (form.value.password.length < 6) {
    errors.value.password = '密碼至少需要6個字元';
    isValid = false;
  }

  // 驗證確認密碼
  if (!form.value.confirmPassword.trim()) {
    errors.value.confirmPassword = '請再次輸入密碼';
    isValid = false;
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = '密碼確認不一致';
    isValid = false;
  }

  return isValid;
};

const submitSetup = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    await useFetch('/api/merchant/setup', {
      method: 'POST',
      body: form.value,
    });

    // 設定完成，重定向到 dashboard
    await navigateTo('/admin/dashboard');
  } catch (error) {
    console.error('Setup failed:', error);
    alert('設定失敗，請檢查輸入的資訊是否正確');
  } finally {
    isSubmitting.value = false;
  }
};

useHead({
  title: 'thankQ-商家後台系統',
  meta: [
    {
      name: 'description',
      content: '使用thankQ商家後台系統，打造屬於自己的線上點餐。',
    },
  ],
});
</script>
