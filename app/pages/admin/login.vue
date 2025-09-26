<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 relative overflow-hidden"
  >
    <!-- 背景裝飾 -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- 主要內容 -->
    <div class="relative z-10 max-w-md w-full">
      <!-- 卡片容器 -->
      <div
        class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 space-y-8"
      >
        <!-- 標題區塊 -->
        <div class="text-center space-y-4">
          <img src="/logoType.png" class="max-w-50 w-full h-auto mx-auto" />
          <h1 class="text-xl font-bold text-gray-800">商家後台系統</h1>
          <div class="space-y-2">
            <div class="text-sm text-gray-400 space-y-1">
              <p>✨ 使用 LINE 打造自己的線上點餐平台</p>
              <!-- <p>✨ 即時訂單管理</p>
              <p>📊 營收數據分析</p>
              <p>🍽️ 菜單品項控制</p> -->
            </div>
          </div>
        </div>

        <!-- 登入方式切換 -->
        <div class="flex rounded-lg bg-gray-100 p-1">
          <button
            @click="loginMode = 'login'"
            :class="{
              'bg-white shadow-sm': loginMode === 'login',
              'bg-transparent': loginMode !== 'login',
            }"
            class="flex-1 py-2 text-sm font-medium transition-all duration-200 rounded-md"
          >
            帳號登入
          </button>
          <button
            @click="loginMode = 'register'"
            :class="{
              'bg-white shadow-sm': loginMode === 'register',
              'bg-transparent': loginMode !== 'register',
            }"
            class="flex-1 py-2 text-sm font-medium transition-all duration-200 rounded-md"
          >
            註冊
          </button>
        </div>

        <!-- 帳號密碼登入表單 -->
        <form
          v-if="loginMode === 'login'"
          @submit.prevent="loginWithCredentials"
          class="space-y-4"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >帳號</label
            >
            <input
              v-model="loginForm.username"
              type="text"
              required
              placeholder="請輸入帳號"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              :class="{'border-red-500': errors.username}"
              @focus="errors.username = ''"
            />
            <p v-if="errors.username" class="text-red-500 text-sm mt-1">
              {{ errors.username }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >密碼</label
            >
            <input
              v-model="loginForm.password"
              type="password"
              required
              placeholder="請輸入密碼"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              :class="{'border-red-500': errors.password}"
              @focus="errors.password = ''"
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">
              {{ errors.password }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center items-center py-4 px-6 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <div
              v-if="isLoading"
              class="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            {{ isLoading ? '登入中...' : '登入' }}
          </button>
        </form>

        <!-- 第三方登入按鈕 -->
        <div v-if="loginMode === 'register'">
          <button
            @click="loginWithLine"
            :disabled="isLoading"
            class="w-full flex justify-center items-center py-4 px-6 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-500 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg
              v-if="!isLoading"
              class="w-5 h-5 mr-3"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
              />
            </svg>
            <div
              v-if="isLoading"
              class="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            {{ isLoading ? '登入中...' : 'LINE 登入' }}
          </button>

          <!-- <div class="mt-4 text-center text-sm text-gray-500">
            <p>註冊商家帳號</p>
          </div> -->
        </div>

        <!-- 底部資訊 -->
        <div class="text-center text-xs text-gray-400 mt-6">
          <p>安全登入 • 資料加密保護</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});

const isLoading = ref(false);
const loginMode = ref('login'); // 'login' 或 'register'

const loginForm = ref({
  username: '',
  password: '',
});

const errors = ref({
  username: '',
  password: '',
});

onMounted(() => {
  const token = useCookie('auth-token');
  if (token.value) {
    navigateTo('/admin/dashboard');
  }
});

// 帳號密碼登入
const loginWithCredentials = async () => {
  if (!validateLoginForm()) {
    return;
  }

  isLoading.value = true;
  try {
    const {data} = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        username: loginForm.value.username,
        password: loginForm.value.password,
      },
    });

    if (data.success) {
      const token = useCookie('auth-token');
      token.value = data.token;
      // 同時儲存到 localStorage
      localStorage.setItem('auth-token', data.token);
      await navigateTo('/admin/dashboard');
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.statusCode === 401) {
      errors.value.password = '帳號或密碼錯誤';
    } else {
      alert('登入失敗，請稍後再試');
    }
  } finally {
    isLoading.value = false;
  }
};

// 驗證登入表單
const validateLoginForm = () => {
  errors.value = {};
  let isValid = true;

  if (!loginForm.value.username.trim()) {
    errors.value.username = '請輸入帳號';
    isValid = false;
  }

  if (!loginForm.value.password.trim()) {
    errors.value.password = '請輸入密碼';
    isValid = false;
  }

  return isValid;
};

// LINE 登入（第三方登入）
const loginWithLine = async () => {
  isLoading.value = true;
  try {
    window.location.href = '/api/auth/line';
  } catch (error) {
    console.error('Login error:', error);
    isLoading.value = false;
  }
};
// SEO
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
