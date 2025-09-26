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
            <h1 class="text-lg font-semibold text-gray-900">設定密碼</h1>
            <p class="text-sm text-gray-500">設定您的登入密碼</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 py-6">
      <div class="max-w-md mx-auto">
        <form @submit.prevent="resetPassword" class="space-y-6">
          <!-- 密碼重置表單 -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center space-x-3">
                <div
                  class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">設定密碼</h2>
                  <p class="text-sm text-gray-500">請設定您的登入密碼</p>
                </div>
              </div>
            </div>

            <div class="p-6 space-y-4">
              <!-- 新密碼 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  新密碼 *
                </label>
                <input
                  v-model="form.newPassword"
                  type="password"
                  required
                  placeholder="請輸入新密碼"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  :class="{'border-red-500': errors.newPassword}"
                  @focus="errors.newPassword = ''"
                />
                <p v-if="errors.newPassword" class="text-red-500 text-xs mt-1">
                  {{ errors.newPassword }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  至少6個字元，建議包含英文和數字
                </p>
              </div>

              <!-- 確認新密碼 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  確認新密碼 *
                </label>
                <input
                  v-model="form.confirmPassword"
                  type="password"
                  required
                  placeholder="再次輸入新密碼"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  :class="{'border-red-500': errors.confirmPassword}"
                  @focus="errors.confirmPassword = ''"
                />
                <p
                  v-if="errors.confirmPassword"
                  class="text-red-500 text-xs mt-1"
                >
                  {{ errors.confirmPassword }}
                </p>
              </div>
            </div>
          </div>

          <!-- 提交按鈕 -->
          <div class="flex space-x-3">
            <button
              type="button"
              @click="goBack"
              class="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              取消
            </button>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg text-sm transition-colors duration-200 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting">設定中...</span>
              <span v-else>設定密碼</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// definePageMeta({
//   middleware: 'auth'
// });

const form = ref({
  newPassword: '',
  confirmPassword: '',
});

const errors = ref({
  newPassword: '',
  confirmPassword: '',
});

const isSubmitting = ref(false);

// 返回上一頁
const goBack = () => {
  navigateTo('/admin/store-info');
};

// 驗證表單
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  // 驗證新密碼
  if (!form.value.newPassword.trim()) {
    errors.value.newPassword = '請輸入新密碼';
    isValid = false;
  } else if (form.value.newPassword.length < 6) {
    errors.value.newPassword = '密碼至少需要6個字元';
    isValid = false;
  }

  // 驗證確認密碼
  if (!form.value.confirmPassword.trim()) {
    errors.value.confirmPassword = '請再次輸入新密碼';
    isValid = false;
  } else if (form.value.newPassword !== form.value.confirmPassword) {
    errors.value.confirmPassword = '新密碼確認不一致';
    isValid = false;
  }

  return isValid;
};

// 重置密碼
const resetPassword = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        newPassword: form.value.newPassword,
      },
    });

    alert('密碼設定成功！');
    await navigateTo('/admin/store-info');
  } catch (error) {
    console.error('Reset password failed:', error);
    alert('密碼設定失敗，請稍後再試');
  } finally {
    isSubmitting.value = false;
  }
};

// SEO
useHead({
  title: '設定密碼 - thankQ商家後台',
  meta: [
    {
      name: 'description',
      content: '設定您的登入密碼',
    },
  ],
});
</script>
