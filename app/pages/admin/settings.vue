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
            <h1 class="text-lg font-semibold text-gray-900">進階設定</h1>
            <p class="text-sm text-gray-500">配置 LINE 頻道與通知設定</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 py-6">
      <form @submit.prevent="saveSettings" class="space-y-6">
        <!-- LINE 頻道設定區塊 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  LINE 頻道設定
                </h2>
                <p class="text-sm text-gray-500">配置顧客登入與訊息發送功能</p>
              </div>
            </div>
          </div>

          <div class="p-6">
            <div class="space-y-4">
              <!-- LINE Channel ID -->
              <div class="py-4 border-b border-gray-100">
                <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div class="sm:w-1/3">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-700"
                        >LINE_CHANNEL_ID</span
                      >
                      <span class="text-red-500 ml-1">*</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">頻道 ID</p>
                  </div>
                  <div class="flex-1 flex items-center space-x-2 min-w-0">
                    <input
                      v-if="editMode.line_channel_id"
                      v-model="settings.line_channel_id"
                      type="text"
                      placeholder="1234567890"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-mono"
                      :class="{'border-red-500': errors.line_channel_id}"
                      @focus="errors.line_channel_id = ''"
                    />
                    <div
                      v-else
                      class="flex-1 px-3 py-2 text-sm font-mono text-gray-700 bg-gray-50 rounded-md break-all"
                    >
                      {{ settings.line_channel_id || '未設定' }}
                    </div>

                    <button
                      type="button"
                      @click="toggleEdit('line_channel_id')"
                      class="p-2 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
                    >
                      <svg
                        v-if="!editMode.line_channel_id"
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <p
                  v-if="errors.line_channel_id"
                  class="text-red-500 text-xs mt-2"
                >
                  {{ errors.line_channel_id }}
                </p>
              </div>

              <!-- LINE Channel Secret -->
              <div class="py-4 border-b border-gray-100">
                <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div class="sm:w-1/3">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-700"
                        >LINE_CHANNEL_SECRET</span
                      >
                      <span class="text-red-500 ml-1">*</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">頻道密鑰</p>
                  </div>
                  <div class="flex-1 flex items-center space-x-2 min-w-0">
                    <input
                      v-if="editMode.line_channel_secret"
                      v-model="settings.line_channel_secret"
                      type="text"
                      placeholder="請輸入 Channel Secret"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-mono"
                      :class="{'border-red-500': errors.line_channel_secret}"
                      @focus="errors.line_channel_secret = ''"
                    />
                    <div
                      v-else
                      class="flex-1 px-3 py-2 text-sm font-mono text-gray-700 bg-gray-50 rounded-md break-all"
                    >
                      {{
                        settings.line_channel_secret
                          ? '••••••••••••••••••••••••••••••••'
                          : '未設定'
                      }}
                    </div>

                    <button
                      type="button"
                      @click="toggleEdit('line_channel_secret')"
                      class="p-2 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
                    >
                      <svg
                        v-if="!editMode.line_channel_secret"
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <p
                  v-if="errors.line_channel_secret"
                  class="text-red-500 text-xs mt-2"
                >
                  {{ errors.line_channel_secret }}
                </p>
              </div>

              <!-- LINE Channel Access Token -->
              <div class="py-4 border-b border-gray-100">
                <div class="flex flex-col gap-3">
                  <div class="sm:w-1/3">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-700"
                        >LINE_ACCESS_TOKEN</span
                      >
                      <span class="text-red-500 ml-1">*</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">存取權杖</p>
                  </div>
                  <div class="flex-1 flex items-start space-x-2 min-w-0">
                    <div class="flex-1 min-w-0">
                      <textarea
                        v-if="editMode.line_channel_access_token"
                        v-model="settings.line_channel_access_token"
                        placeholder="長期或短期的 Channel Access Token..."
                        rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-mono"
                        :class="{
                          'border-red-500': errors.line_channel_access_token,
                        }"
                        @focus="errors.line_channel_access_token = ''"
                      ></textarea>
                      <div
                        v-else
                        class="w-full px-3 py-2 text-sm font-mono text-gray-700 bg-gray-50 rounded-md min-h-[80px] break-all overflow-hidden"
                      >
                        {{ settings.line_channel_access_token || '未設定' }}
                      </div>
                      <p
                        v-if="errors.line_channel_access_token"
                        class="text-red-500 text-xs mt-1"
                      >
                        {{ errors.line_channel_access_token }}
                      </p>
                    </div>

                    <button
                      type="button"
                      @click="toggleEdit('line_channel_access_token')"
                      class="p-2 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
                    >
                      <svg
                        v-if="!editMode.line_channel_access_token"
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Telegram 通知設定 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Telegram 通知
                </h2>
                <p class="text-sm text-gray-500">接收新訂單通知</p>
              </div>
            </div>
          </div>

          <div class="p-6">
            <div class="py-4">
              <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                <div class="sm:w-1/3">
                  <div class="flex items-center">
                    <span class="text-sm font-medium text-gray-700"
                      >TELEGRAM_CHAT_ID</span
                    >
                    <span class="text-red-500 ml-1">*</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">通知聊天室</p>
                </div>
                <div class="flex-1 flex items-center space-x-2 min-w-0">
                  <div class="flex-1 min-w-0">
                    <input
                      v-if="editMode.telegram_chat_id"
                      v-model="settings.telegram_chat_id"
                      type="text"
                      placeholder="-1001234567890"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-mono"
                      :class="{
                        'border-red-500': errors.telegram_chat_id,
                      }"
                      @focus="errors.telegram_chat_id = ''"
                    />
                    <div
                      v-else
                      class="w-full px-3 py-2 text-sm font-mono text-gray-700 bg-gray-50 rounded-md break-all"
                    >
                      {{ settings.telegram_chat_id || '未設定' }}
                    </div>
                    <p
                      v-if="errors.telegram_chat_id"
                      class="text-red-500 text-xs mt-1"
                    >
                      {{ errors.telegram_chat_id }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      接收新訂單通知（必填）
                    </p>
                  </div>

                  <button
                    type="button"
                    @click="toggleEdit('telegram_chat_id')"
                    class="p-2 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
                  >
                    <svg
                      v-if="!editMode.telegram_chat_id"
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- LINE Pay 設定 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91 2.28.6 4.18 1.58 4.18 3.91 0 1.82-1.33 2.96-3.12 3.16z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  LINE Pay 設定
                </h2>
                <p class="text-sm text-gray-500">行動支付配置（選填）</p>
              </div>
            </div>
          </div>

          <div class="p-6">
            <!-- LINE Pay Channel ID -->
            <div class="py-4 border-b border-gray-100">
              <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                <div class="sm:w-1/3">
                  <div class="flex items-center">
                    <span class="text-sm font-medium text-gray-700"
                      >LINE_PAY_CHANNEL_ID</span
                    >
                  </div>
                  <p class="text-xs text-gray-500 mt-1">LINE Pay 通道 ID</p>
                </div>
                <div class="flex-1 flex items-center space-x-2">
                  <input
                    v-if="editMode.linePay_channel_id"
                    v-model="settings.linePay_channel_id"
                    type="text"
                    placeholder="請輸入 LINE Pay Channel ID"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-mono"
                    :class="{'border-red-500': errors.linePay_channel_id}"
                    @focus="errors.linePay_channel_id = ''"
                  />
                  <div
                    v-else
                    class="flex-1 px-3 py-2 text-sm font-mono text-gray-700 bg-gray-50 rounded-md break-all"
                  >
                    {{ settings.linePay_channel_id || '未設定' }}
                  </div>

                  <button
                    type="button"
                    @click="toggleEdit('linePay_channel_id')"
                    class="p-2 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
                  >
                    <svg
                      v-if="!editMode.linePay_channel_id"
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <p
                v-if="errors.linePay_channel_id"
                class="text-red-500 text-xs mt-1"
              >
                {{ errors.linePay_channel_id }}
              </p>
            </div>

            <!-- LINE Pay Secret Key -->
            <div class="py-4">
              <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                <div class="sm:w-1/3">
                  <div class="flex items-center">
                    <span class="text-sm font-medium text-gray-700"
                      >LINE_PAY_SECRET_KEY</span
                    >
                  </div>
                  <p class="text-xs text-gray-500 mt-1">LINE Pay 密鑰</p>
                </div>
                <div class="flex-1 flex items-center space-x-2">
                  <input
                    v-if="editMode.linePay_secret_key"
                    v-model="settings.linePay_secret_key"
                    type="password"
                    placeholder="請輸入 LINE Pay Secret Key"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-mono"
                    :class="{'border-red-500': errors.linePay_secret_key}"
                    @focus="errors.linePay_secret_key = ''"
                  />
                  <div
                    v-else
                    class="flex-1 px-3 py-2 text-sm font-mono text-gray-700 bg-gray-50 rounded-md break-all"
                  >
                    {{
                      settings.linePay_secret_key
                        ? '••••••••••••••••••••••••••••••••'
                        : '未設定'
                    }}
                  </div>

                  <button
                    type="button"
                    @click="toggleEdit('linePay_secret_key')"
                    class="p-2 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
                  >
                    <svg
                      v-if="!editMode.linePay_secret_key"
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <p
                v-if="errors.linePay_secret_key"
                class="text-red-500 text-xs mt-1"
              >
                {{ errors.linePay_secret_key }}
              </p>
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
              :disabled="isSubmitting"
              class="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg text-sm transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? '儲存中...' : '儲存設定' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// definePageMeta({
//   middleware: 'auth'
// })
const merchantInfo = ref('');

const settings = ref({
  line_channel_id: '',
  line_channel_secret: '',
  line_channel_access_token: '',
  telegram_chat_id: '',
  linePay_channel_id: '',
  linePay_secret_key: '',
});

const errors = ref({
  line_channel_id: '',
  line_channel_secret: '',
  line_channel_access_token: '',
  telegram_chat_id: '',
  linePay_channel_id: '',
  linePay_secret_key: '',
});

const editMode = ref({
  line_channel_id: false,
  line_channel_secret: false,
  line_channel_access_token: false,
  telegram_chat_id: false,
  linePay_channel_id: false,
  linePay_secret_key: false,
});

const isSubmitting = ref(false);

// 載入現有設定
const loadSettings = async () => {
  try {
    const {data} = await $fetch('/api/merchant/info');
    settings.value = {
      line_channel_id: data.line_channel_id || '',
      line_channel_secret: data.line_channel_secret || '',
      line_channel_access_token: data.line_channel_access_token || '',
      telegram_chat_id: data.telegram_chat_id || '',
      linePay_channel_id: data.linePay_channel_id || '',
      linePay_secret_key: data.linePay_secret_key || '',
    };
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
};

// 切換編輯模式
const toggleEdit = (field) => {
  editMode.value[field] = !editMode.value[field];
  if (!editMode.value[field]) {
    errors.value[field] = '';
  }
};

// 驗證表單
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  // 只驗證處於編輯模式的必填欄位
  if (editMode.value.line_channel_id || !settings.value.line_channel_id) {
    if (!settings.value.line_channel_id.trim()) {
      errors.value.line_channel_id = '請輸入 Channel ID';
      isValid = false;
    } else if (!/^\d+$/.test(settings.value.line_channel_id.trim())) {
      errors.value.line_channel_id = 'Channel ID 應該是純數字';
      isValid = false;
    }
  }

  if (
    editMode.value.line_channel_secret ||
    !settings.value.line_channel_secret
  ) {
    if (!settings.value.line_channel_secret.trim()) {
      errors.value.line_channel_secret = '請輸入 Channel Secret';
      isValid = false;
    }
  }

  if (
    editMode.value.line_channel_access_token ||
    !settings.value.line_channel_access_token
  ) {
    if (!settings.value.line_channel_access_token.trim()) {
      errors.value.line_channel_access_token = '請輸入 Channel Access Token';
      isValid = false;
    }
  }

  // Telegram 為必填
  if (editMode.value.telegram_chat_id || !settings.value.telegram_chat_id) {
    if (!settings.value.telegram_chat_id.trim()) {
      errors.value.telegram_chat_id = '請輸入 Telegram Chat ID';
      isValid = false;
    } else if (!/^-?\d+$/.test(settings.value.telegram_chat_id.trim())) {
      errors.value.telegram_chat_id = 'Chat ID 格式不正確';
      isValid = false;
    }
  }

  return isValid;
};

// 儲存設定
const saveSettings = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    await $fetch('/api/merchant/settings', {
      method: 'POST',
      body: settings.value,
    });

    // 關閉所有編輯模式
    Object.keys(editMode.value).forEach((key) => {
      editMode.value[key] = false;
    });

    alert('設定已儲存');
  } catch (error) {
    console.error('Save settings failed:', error);
    alert('儲存失敗，請檢查輸入的資訊');
  } finally {
    isSubmitting.value = false;
  }
};

// 載入商家資訊
const loadMerchantInfo = async () => {
  try {
    const {data} = await $fetch('/api/merchant/info');
    merchantInfo.value = data;
  } catch (error) {
    console.error('Failed to load merchant info:', error);
  }
};

// 返回按鈕
const goBack = () => {
  navigateTo('/admin/dashboard');
};

useHead({
  title: computed(() =>
    merchantInfo.value.store_name
      ? `${merchantInfo.value.store_name} - 進階設定`
      : '進階設定'
  ),
  meta: [
    {
      name: 'description',
      content: computed(
        () => merchantInfo.value.store_description || '進階設定'
      ),
    },
  ],
});

// 頁面載入時取得設定
onMounted(() => {
  loadSettings();
  loadMerchantInfo();
});
</script>
