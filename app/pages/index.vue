<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav
      class="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50"
    >
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <img src="/logoType.png" class="h-10 w-auto"></img>
          </div>
          <div class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-gray-600 hover:text-gray-900"
              >功能特色</a
            >
            <a href="#pricing" class="text-gray-600 hover:text-gray-900"
              >方案價格</a
            >
            <a href="#demo" class="text-gray-600 hover:text-gray-900"
              >系統展示</a
            >
            <button
              @click="goToRegister"
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              立即開店
            </button>
          </div>
          <button class="md:hidden" @click="toggleMobileMenu">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <!-- Mobile Menu -->
        <div
          v-show="showMobileMenu"
          class="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t"
        >
          <div class="px-4 py-4 space-y-4">
            <a
              href="#features"
              @click="showMobileMenu = false"
              class="block text-gray-600 hover:text-gray-900 py-2"
            >
              功能特色
            </a>
            <a
              href="#pricing"
              @click="showMobileMenu = false"
              class="block text-gray-600 hover:text-gray-900 py-2"
            >
              方案價格
            </a>
            <a
              href="#demo"
              @click="showMobileMenu = false"
              class="block text-gray-600 hover:text-gray-900 py-2"
            >
              系統展示
            </a>
            <button
              @click="goToRegister"
              class="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-left"
            >
              立即開店
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section
      class="pt-20 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
    >
      <div class="max-w-6xl mx-auto px-4 py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="space-y-4">
              <h1
                class="text-4xl md:text-6xl font-bold text-gray-900 leading-tight"
              >
                讓你的餐廳
                <span
                  class="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                >
                  數位化
                </span>
              </h1>
              <p class="text-xl text-gray-600 leading-relaxed">
                透過 LINE 官方帳號整合的智能點餐系統，<br />
                提升營運效率，增加客戶滿意度
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <button
                @click="goToRegister"
                class="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
              >
                🚀 免費開始使用
              </button>
              <button
                @click="scrollToDemo"
                class="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
              >
                📱 查看展示
              </button>
            </div>

            <div class="flex items-center space-x-8 text-sm text-gray-500">
              <div class="flex items-center space-x-2">
                <svg
                  class="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>30秒快速設定</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg
                  class="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>免費試用</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg
                  class="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>LINE 整合</span>
              </div>
            </div>
          </div>

          <div class="relative">
            <div
              class="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20"
            >
              <!-- 大型品牌 Logo -->
              <div class="text-center space-y-6">
                <div class="relative inline-block">
                  <div
                    class="w-32 h-32 bg-[#00ff41] rounded-3xl flex items-center justify-start px-4 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
                  >
                    <span class="text-dark font-bold text-9xl">t</span>
                  </div>
                  <div
                    class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <span class="text-white text-sm font-bold">!</span>
                  </div>
                </div>

                <div class="space-y-3">
                  <h3
                    class="text-4xl font-bold bg-gradient-to-br from-green-400 via-green-500 to-gray-800 bg-clip-text text-transparent"
                  >
                    thankQ
                  </h3>
                  <p class="text-lg text-gray-600 font-medium">智能點餐系統</p>
                  <div
                    class="flex justify-center space-x-6 text-sm text-gray-500"
                  >
                    <div class="flex items-center space-x-2">
                      <div
                        class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                      ></div>
                      <span>LINE整合</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div
                        class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                        style="animation-delay: 0.5s"
                      ></div>
                      <span>智能管理</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div
                        class="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                        style="animation-delay: 1s"
                      ></div>
                      <span>營收提升</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
              >
                ✨ 新一代系統
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            為什麼選擇 thankQ？
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            全方位的餐廳數位化解決方案，讓您的餐廳營運更加智能高效
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- LINE 整合 -->
          <div
            class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 hover:shadow-lg transition-shadow"
          >
            <div
              class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-6"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.630-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              LINE 官方帳號整合
            </h3>
            <p class="text-gray-600">
              直接透過 LINE 接收訂單，自動發送確認訊息給顧客，提升服務效率
            </p>
          </div>

          <!-- 智能營業時間 -->
          <div
            class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 hover:shadow-lg transition-shadow"
          >
            <div
              class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              智能營業時間管理
            </h3>
            <p class="text-gray-600">
              自動根據營業時間開關接單，支援特殊營業日設定，手動控制營業狀態
            </p>
          </div>

          <!-- 多元付款 -->
          <div
            class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 hover:shadow-lg transition-shadow"
          >
            <div
              class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">多元付款方式</h3>
            <p class="text-gray-600">
              支援現金、LINE Pay、銀行轉帳，滿足不同顧客的付款需求
            </p>
          </div>

          <!-- 商品管理 -->
          <div
            class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 hover:shadow-lg transition-shadow"
          >
            <div
              class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-6"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">靈活商品管理</h3>
            <p class="text-gray-600">
              輕鬆管理菜單商品、價格調整、分類排序，支援商品選項組合
            </p>
          </div>

          <!-- 外送服務 -->
          <div
            class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-8 hover:shadow-lg transition-shadow"
          >
            <div
              class="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mb-6"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">外送服務管理</h3>
            <p class="text-gray-600">
              設定外送範圍、費用計算、免費外送門檻，自動計算配送距離
            </p>
          </div>

          <!-- 營收統計 -->
          <div
            class="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-8 hover:shadow-lg transition-shadow"
          >
            <div
              class="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-6"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">營收統計報表</h3>
            <p class="text-gray-600">
              即時查看訂單統計、營收數據，了解系統為您創造的價值
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-8">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
              為什麼餐廳老闆都選擇我們？
            </h2>

            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    提升營運效率
                  </h3>
                  <p class="text-gray-600">
                    自動化訂單處理，減少人工錯誤，讓您專注於料理品質
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    增加營收機會
                  </h3>
                  <p class="text-gray-600">
                    24小時接受預訂，提前訂餐優惠機制，增加客戶黏著度
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    客戶體驗升級
                  </h3>
                  <p class="text-gray-600">
                    LINE 熟悉介面，即時訂單確認，提升客戶滿意度
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    數據化經營
                  </h3>
                  <p class="text-gray-600">
                    詳細統計報表，了解顧客喜好，制定更好的經營策略
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-2xl p-8">
            <div class="text-center space-y-6">
              <h3 class="text-2xl font-bold text-gray-900">
                開始您的數位化之旅
              </h3>
              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-4 bg-green-50 rounded-lg"
                >
                  <span class="font-medium text-gray-900">成功接單</span>
                  <span class="text-2xl font-bold text-green-600">247</span>
                </div>
                <div
                  class="flex items-center justify-between p-4 bg-blue-50 rounded-lg"
                >
                  <span class="font-medium text-gray-900">累積營收</span>
                  <span class="text-2xl font-bold text-blue-600"
                    >NT$ 182,450</span
                  >
                </div>
              </div>
              <p class="text-sm text-gray-500">
                💡 透過 thankQ 系統幫您賺取的收益
              </p>
              <button
                @click="goToRegister"
                class="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                我也要開始賺錢！
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section id="demo" class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            系統操作展示
          </h2>
          <p class="text-xl text-gray-600">簡單易用的管理介面，30秒快速上手</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-gray-50 rounded-xl p-8 text-center">
            <div
              class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6"
            >
              <svg
                class="w-8 h-8 text-green-600"
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
            <h3 class="text-xl font-bold text-gray-900 mb-3">商家後台管理</h3>
            <p class="text-gray-600 mb-6">
              簡潔的管理介面，輕鬆管理營業時間、商品、訂單統計
            </p>
          </div>

          <div class="bg-gray-50 rounded-xl p-8 text-center">
            <div
              class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6"
            >
              <svg
                class="w-8 h-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.630-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">LINE 顧客點餐</h3>
            <p class="text-gray-600 mb-6">
              顧客透過 LINE 輕鬆點餐，即時收到訂單確認訊息
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-green-600 to-blue-600">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <div class="space-y-8 text-white">
          <h2 class="text-3xl md:text-5xl font-bold">
            準備好讓您的餐廳數位化了嗎？
          </h2>
          <p class="text-xl opacity-90">
            立即註冊，30秒完成設定，馬上開始接收訂單
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              @click="goToRegister"
              class="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-colors"
            >
              🚀 立即免費註冊
            </button>
            <a
              href="https://line.me/R/ti/p/@822ergcu?oat__id=5875896"
              class="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-xl font-bold text-lg transition-colors"
            >
              📞 聯繫我們
            </a>
          </div>
          <p class="text-sm opacity-75 text-center">
           thankq.bot.01@gmail.com
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="relative">
                <div
                  class="w-8 h-8 rounded-lg flex items-center justify-start pl-1"
                  style="background-color: #00ff41"
                >
                  <span class="text-black font-bold text-3xl">t</span>
                </div>
                <div
                  class="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full flex items-center justify-center"
                >
                  <span class="text-white text-xs font-bold">!</span>
                </div>
              </div>
              <span class="text-xl font-bold text-green-400">thankQ</span>
            </div>
            <p class="text-gray-400 text-sm">
              讓餐廳數位化變得簡單，<br />
              提升營運效率的智能點餐系統
            </p>
          </div>

          <div class="space-y-4">
            <h3 class="font-semibold">產品功能</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>LINE 官方帳號整合</li>
              <li>智能營業時間管理</li>
              <li>商品管理系統</li>
              <li>多元付款方式</li>
            </ul>
          </div>

          <div class="space-y-4">
            <h3 class="font-semibold">支援服務</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>使用說明文件</li>
              <li>技術支援</li>
              <li>LINE 整合協助</li>
              <li>營業優化建議</li>
            </ul>
          </div>

          <div class="space-y-4">
            <h3 class="font-semibold">聯繫我們</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>📧 thankq.bot.01@gmail.com</li>
              <li>💬 <a href="https://line.me/R/ti/p/@822ergcu?oat__id=5875896" target="_blank" class="text-green-400 hover:text-green-300">LINE 客服</a></li>
              <li>🕒 週一至週五 9:00-18:00</li>
            </ul>
          </div>
        </div>

        <div
          class="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400"
        >
          <p>&copy; 2026 thankQ. 版權所有. Made with ❤️ for restaurants.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const showMobileMenu = ref(false);

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const goToRegister = () => {
  navigateTo('/admin/login');
};

const scrollToDemo = () => {
  document.getElementById('demo').scrollIntoView({
    behavior: 'smooth',
  });
};

// SEO Meta
useHead({
  title: 'thankQ - 餐廳智能點餐系統 | LINE 官方帳號整合',
  meta: [
    {
      name: 'description',
      content:
        'thankQ 是專為餐廳設計的智能點餐系統，整合 LINE 官方帳號，提供自動化訂單管理、營業時間控制、多元付款方式，幫助餐廳提升營運效率和客戶滿意度。立即免費註冊開始使用！',
    },
    {
      name: 'keywords',
      content:
        'LINE點餐系統,餐廳管理系統,智能點餐,LINE官方帳號,餐廳數位化,線上點餐,外送系統,餐廳POS,thankQ',
    },
    {
      property: 'og:title',
      content: 'thankQ - 餐廳智能點餐系統',
    },
    {
      property: 'og:description',
      content:
        '透過 LINE 官方帳號整合的智能點餐系統，提升營運效率，增加客戶滿意度。30秒快速設定，立即開始接收訂單！',
    },
    {
      property: 'og:type',
      content: 'website',
    },
  ],
});

// Smooth scrolling for navigation links
onMounted(() => {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({behavior: 'smooth'});
      }
    });
  });
});
</script>

<style scoped>
/* 自訂樣式 */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* 滾動動畫 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .text-4xl {
    font-size: 2rem;
  }

  .text-6xl {
    font-size: 3rem;
  }
}
</style>
