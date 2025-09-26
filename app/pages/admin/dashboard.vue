<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-4 py-4">
        <div>
          <div class="grid grid-cols-3 flex items-center justify-center">
            <div>
              <img class="max-w-20" src="/logoType.png" />
            </div>
            <div class="flex items-center justify-center space-x-3">
              <span class="text-xl font-bold text-gray-900">
                商家後台系統
              </span>
            </div>
            <div class="flex justify-end">
              <button
                @click="logout"
                class="text-red-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="currentColor"
                    d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-.72 4.594L9.595 15.28l-.72.72l.72.72l5.687 5.686L16.72 21l-4-4H23v-2H12.72l4-4z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center font-bold mt-5">
      <button
        @click="goToStoreInfo"
        class="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-1 transition-colors"
      >
        <div
          class="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-xl"
        >
          {{ getStoreInitial(merchantInfo.name) }}
        </div>
        <div class="text-pink-600 text-xl ml-1">
          {{ merchantInfo.store_name }}
        </div>
      </button>
    </div>
    <!-- Main Content -->
    <div class="px-4 py-6">
      <!-- 訂單統計卡片 -->
      <div
        class="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg p-6 mb-6 text-white"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center"
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold">營業成果</h2>
              <p class="text-emerald-100 text-sm">系統為您累積的收益</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- 成功訂單數 -->
          <div 
            @click="goToLineUsage"
            class="bg-white/10 rounded-lg p-4 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-emerald-100 text-sm font-medium">成功接單</span>
              <div class="flex items-center space-x-1">
                <svg
                  class="w-4 h-4 text-yellow-300"
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
                <svg
                  class="w-5 h-5 text-emerald-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2"
                  />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-white mb-1">
              {{ animatedOrderCount }}
            </div>
            <div class="text-emerald-100 text-xs">筆訂單 (點擊查看重要提醒)</div>
          </div>

          <!-- 累積金額 -->
          <div class="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-emerald-100 text-sm font-medium">累積收益</span>
              <svg
                class="w-5 h-5 text-emerald-200"
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
            <div class="text-3xl font-bold text-white mb-1">
              NT$ {{ animatedRevenue.toLocaleString() }}
            </div>
            <div class="text-emerald-100 text-xs">總金額</div>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-white/20">
          <p class="text-emerald-100 text-sm text-center">
            💡 透過 thankQ 系統幫您賺取的收益
          </p>
        </div>
      </div>

      <!-- 營業狀態卡片 -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">營業狀態</h2>
              <p class="text-sm text-gray-500">控制店家是否接受新訂單</p>
            </div>
          </div>

          <!-- 營業狀態切換 -->
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="isBusinessOpen"
                  @change="toggleBusinessStatus"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"
                ></div>
              </label>
              <span
                class="text-sm font-medium min-w-[60px]"
                :class="isBusinessOpen ? 'text-green-600' : 'text-red-600'"
              >
                {{ isBusinessOpen ? '營業中' : '已關閉' }}
              </span>
            </div>

            <!-- 手動控制狀態提示 -->
            <div
              v-if="merchantInfo.manual_override_until_midnight === 1"
              class="flex items-center space-x-2 text-xs"
            >
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span class="text-yellow-600">手動控制中 (至今日午夜)</span>
            </div>
            <div v-else class="flex items-center space-x-2 text-xs">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span class="text-blue-600">自動控制 (依營業時間)</span>
            </div>
          </div>
        </div>

        <!-- 當營業關閉時顯示的訂餐服務開關 -->
        <div v-if="!isBusinessOpen" class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">訂餐服務</h3>
                <p class="text-sm text-gray-500">關閉營業時仍可接受預訂單</p>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="isOrderServiceOpen"
                  @change="toggleOrderService"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"
                ></div>
              </label>
              <span
                class="text-sm font-medium min-w-[60px]"
                :class="
                  isOrderServiceOpen ? 'text-orange-600' : 'text-gray-600'
                "
              >
                {{ isOrderServiceOpen ? '開啟' : '關閉' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能按鈕區 -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <!-- 設定按鈕 -->
        <button
          @click="goToSettings"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div class="text-center">
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900">進階設定</h3>
            <p class="text-sm text-gray-500 mt-1">LINE 頻道配置</p>
          </div>
        </button>

        <!-- 商品管理按鈕 -->
        <button
          @click="goToProducts"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div class="text-center">
            <div
              class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-6 h-6 text-purple-600"
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
            <h3 class="font-medium text-gray-900">商品管理</h3>
            <p class="text-sm text-gray-500 mt-1">新增、編輯商品</p>
          </div>
        </button>
      </div>

      <!-- 營業時間設定區塊 -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
      >
        <button
          @click="showBusinessHours = !showBusinessHours"
          class="w-full flex items-center justify-between mb-4"
        >
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-indigo-600"
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
            <div>
              <h2 class="text-lg font-semibold text-gray-900 text-start">
                營業時間設定
              </h2>
              <p class="text-sm text-gray-500">設定每日營業時間與特殊休假日</p>
            </div>
          </div>
          <svg
            :class="{'rotate-180': showBusinessHours}"
            class="w-5 h-5 text-gray-400 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div v-show="showBusinessHours" class="space-y-6">
          <!-- 編輯按鈕 -->
          <div class="flex justify-end">
            <button
              v-if="!isEditingHours"
              @click="startEditingHours"
              class="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              <svg
                class="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <div v-else class="flex items-center space-x-3">
              <button
                @click="cancelEditingHours"
                class="flex items-center space-x-2 text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                <span>取消</span>
              </button>
              <button
                @click="saveBusinessHours"
                class="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <span>保存設定</span>
              </button>
            </div>
          </div>

          <!-- 每週營業時間 -->
          <div class="space-y-3">
            <h3 class="text-sm font-medium text-gray-900">每週營業時間</h3>
            <div
              v-for="(day, index) in weekDays"
              :key="index"
              class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
            >
              <div class="flex items-center space-x-3 w-20">
                <span class="text-sm font-medium text-gray-700">{{
                  day.name
                }}</span>
              </div>

              <div v-if="!isEditingHours" class="text-right">
                <span class="text-sm text-gray-900">
                  {{ getBusinessHourDisplay(day.value) }}
                </span>
              </div>

              <div v-else class="flex items-center space-x-2">
                <label class="flex items-center">
                  <input
                    v-if="businessHours[day.value]"
                    v-model="businessHours[day.value].is_open"
                    type="checkbox"
                    class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span class="ml-1 text-xs text-gray-600">營業</span>
                </label>

                <template v-if="businessHours[day.value]?.is_open">
                  <input
                    v-if="businessHours[day.value]"
                    v-model="businessHours[day.value].open_time"
                    type="time"
                    class="w-28 px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                  <span class="text-xs text-gray-500">-</span>
                  <input
                    v-if="businessHours[day.value]"
                    v-model="businessHours[day.value].close_time"
                    type="time"
                    class="w-28 px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </template>
              </div>
            </div>
          </div>

          <!-- 特殊營業時間 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-gray-900">休假日期設定</h3>
              <button
                v-if="isEditingHours"
                @click="addSpecialHour"
                class="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                + 新增休假日期
              </button>
            </div>

            <div
              v-if="specialHours.length === 0"
              class="text-sm text-gray-500 py-2"
            >
              尚未設定休假日期
            </div>

            <div
              v-for="(special, index) in specialHours"
              :key="index"
              class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
            >
              <!-- 非編輯模式：顯示已保存的休假日期 -->
              <div v-if="!isEditingHours" class="flex-1">
                <div class="text-sm font-medium text-gray-700">
                  {{ formatSpecialDate(special.date) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ special.reason || '休假日' }}
                </div>
              </div>

              <div v-if="!isEditingHours" class="flex items-center space-x-2">
                <span class="text-sm text-gray-900">{{
                  getSpecialHourDisplay(special)
                }}</span>
                <button
                  @click="deleteSpecialHour(special.id, index)"
                  class="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
                  title="刪除休假日期"
                >
                  刪除
                </button>
              </div>

              <!-- 編輯模式 -->
              <div v-else-if="special.id">
                <!-- 已保存的休假日期：只讀顯示 -->
                <div class="flex items-center justify-between flex-1">
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-700">
                      {{ formatSpecialDate(special.date) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ special.reason }}
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500">已保存</span>
                    <button
                      @click="deleteSpecialHour(special.id, index)"
                      class="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </div>

              <div v-else class="flex items-center space-x-2 flex-1">
                <!-- 新增的休假日期：可編輯 -->
                <input
                  v-model="special.date"
                  type="date"
                  :min="getTodayDate()"
                  class="w-28 px-2 py-1 border border-gray-300 rounded text-xs"
                />
                <input
                  v-model="special.reason"
                  type="text"
                  placeholder="休假原因 (必填)"
                  required
                  class="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                />

                <button
                  @click="removeSpecialHour(index)"
                  class="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
                >
                  移除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 訂餐設定區塊 -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
      >
        <button
          @click="showOrderSettings = !showOrderSettings"
          class="w-full flex items-center justify-between mb-4"
        >
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900 text-start">
                訂餐設定
              </h2>
              <p class="text-sm text-gray-500">
                配置用餐方式、支付選項與優惠設定
              </p>
            </div>
          </div>
          <svg
            :class="{'rotate-180': showOrderSettings}"
            class="w-5 h-5 text-gray-400 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div v-show="showOrderSettings" class="space-y-6">
          <!-- 編輯按鈕 -->
          <div class="flex justify-end">
            <button
              v-if="!isEditing"
              @click="startEditing"
              class="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <svg
                class="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <div v-else class="flex items-center space-x-3">
              <button
                @click="cancelEditing"
                class="flex items-center space-x-2 text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                <span>取消</span>
              </button>
              <button
                @click="saveAllSettings"
                class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <span>保存設定</span>
              </button>
            </div>
          </div>

          <!-- 設定項目列表 -->
          <div class="space-y-4">
            <!-- 用餐方式 -->
            <div
              class="flex items-center justify-between py-3 border-b border-gray-200"
            >
              <div class="flex items-center space-x-3">
                <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
                <div>
                  <h3 class="font-medium text-gray-900">用餐方式</h3>
                  <p class="text-xs text-gray-500">設定顧客可選擇的用餐方式</p>
                </div>
              </div>
              <div class="flex-1 mx-6">
                <div v-if="!isEditing" class="text-right">
                  <span class="text-base font-medium text-gray-900">{{
                    getDiningTypesDisplay()
                  }}</span>
                </div>
                <div v-else class="flex flex-wrap justify-end gap-x-4 gap-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="merchantSettings.available_dining_types"
                      type="checkbox"
                      value="takeaway"
                      class="rounded border-gray-300 text-orange-600 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm">外帶</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="merchantSettings.available_dining_types"
                      type="checkbox"
                      value="dine-in"
                      class="rounded border-gray-300 text-orange-600 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm">內用</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 支付方式 (只在有外送服務時顯示) -->
            <div
              v-if="
                merchantSettings.available_dining_types.includes('delivery') ||
                !isEditing
              "
              class="flex items-center justify-between py-3 border-b border-gray-200"
            >
              <div class="flex items-center space-x-3">
                <span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <div>
                  <h3 class="font-medium text-gray-900">支付方式</h3>
                  <p class="text-xs text-gray-500">設定顧客可選擇的支付方式</p>
                </div>
              </div>
              <div class="flex-1 mx-6">
                <div v-if="!isEditing" class="text-right">
                  <span class="text-base font-medium text-gray-900">{{
                    getPaymentMethodsDisplay()
                  }}</span>
                  <!-- 銀行轉帳警告提示 -->
                  <div v-if="hasBankTransferWithoutAccount" class="mt-1">
                    <span
                      class="text-xs text-red-500 bg-red-50 px-2 py-1 rounded"
                    >
                      ⚠️ 銀行轉帳需要先設定收款帳號
                    </span>
                  </div>
                </div>
                <div v-else class="flex flex-wrap justify-end gap-x-4 gap-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="merchantSettings.available_payment_methods"
                      type="checkbox"
                      value="cash"
                      class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm">現場付款</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="merchantSettings.available_payment_methods"
                      type="checkbox"
                      value="bank_transfer"
                      :class="{
                        'rounded border-red-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50':
                          !isBankTransferAvailable,
                        'rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50':
                          isBankTransferAvailable,
                      }"
                    />
                    <span
                      class="ml-2 text-sm"
                      :class="{'text-red-600': !isBankTransferAvailable}"
                    >
                      銀行轉帳
                      <span
                        v-if="!isBankTransferAvailable"
                        class="text-xs text-red-500"
                        >(需設定收款帳號)</span
                      >
                    </span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="merchantSettings.available_payment_methods"
                      type="checkbox"
                      value="mobile"
                      :disabled="!hasLinePaySettings"
                      class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span class="ml-2 text-sm">
                      行動支付 (LINE Pay)
                      <span
                        v-if="!hasLinePaySettings"
                        class="text-red-500 text-xs block"
                      >
                        需先至進階設定配置 LINE Pay
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 提前折扣 -->
            <div
              class="flex items-center justify-between py-3 border-b border-gray-200"
            >
              <div class="flex items-center space-x-3">
                <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <div>
                  <h3 class="font-medium text-gray-900">提前折扣</h3>
                  <p class="text-xs text-gray-500">
                    提前一天訂餐給顧客的優惠折扣率
                  </p>
                </div>
              </div>
              <div class="flex-1 mx-6">
                <div v-if="!isEditing" class="text-right">
                  <span class="text-base font-medium text-gray-900"
                    >{{ merchantSettings.advance_discount_rate || 0 }}%</span
                  >
                </div>
                <div v-else class="flex items-center justify-end space-x-2">
                  <input
                    v-model.number="merchantSettings.advance_discount_rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0"
                    class="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                  <span class="text-sm text-gray-600">%</span>
                </div>
              </div>
            </div>

            <!-- 外送服務 -->
            <div class="py-3 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  <div>
                    <h3 class="font-medium text-gray-900">外送服務</h3>
                    <p class="text-xs text-gray-500">開啟外送服務及相關設定</p>
                  </div>
                </div>
                <div class="flex-1 mx-6">
                  <div v-if="!isEditing" class="text-right">
                    <span
                      :class="{
                        'text-green-600':
                          merchantSettings.available_dining_types.includes(
                            'delivery'
                          ),
                        'text-gray-600':
                          !merchantSettings.available_dining_types.includes(
                            'delivery'
                          ),
                      }"
                      class="text-base font-medium"
                    >
                      {{
                        merchantSettings.available_dining_types.includes(
                          'delivery'
                        )
                          ? '開啟'
                          : '關閉'
                      }}
                    </span>
                  </div>
                  <div v-else class="flex items-center justify-end">
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        :checked="
                          merchantSettings.available_dining_types.includes(
                            'delivery'
                          )
                        "
                        @change="toggleDeliveryService"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"
                      ></div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- 外送詳細設定 (只在開啟外送且編輯模式時顯示) -->
              <div
                v-if="
                  isEditing &&
                  merchantSettings.available_dining_types.includes('delivery')
                "
                class="mt-4 ml-5 space-y-4 pl-4 border-l-2 border-gray-200"
              >
                <!-- 免費外送金額 -->
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">
                      免費外送門檻
                    </h4>
                    <p class="text-xs text-gray-500">
                      訂單金額達此數額享免費外送
                    </p>
                  </div>
                  <div
                    class="flex items-center space-x-2 min-w-[120px] justify-end"
                  >
                    <input
                      v-model.number="merchantSettings.delivery_minimum_amount"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      class="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                    />
                    <span class="text-xs text-gray-600 w-4">元</span>
                  </div>
                </div>

                <!-- 基本外送費 -->
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">
                      基本外送費
                    </h4>
                    <p class="text-xs text-gray-500">基本費用及免費範圍</p>
                  </div>
                  <div
                    class="flex items-center space-x-1 min-w-[120px] justify-end"
                  >
                    <input
                      v-model.number="merchantSettings.delivery_base_fee"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      class="w-12 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                    />
                    <span class="text-xs text-gray-600">元</span>
                    <input
                      v-model.number="merchantSettings.delivery_free_km"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0"
                      class="w-12 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                    />
                    <span class="text-xs text-gray-600">km</span>
                  </div>
                </div>

                <!-- 每公里外送費 -->
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">
                      每公里加收
                    </h4>
                    <p class="text-xs text-gray-500">超出免費範圍每公里費用</p>
                  </div>
                  <div
                    class="flex items-center space-x-2 min-w-[120px] justify-end"
                  >
                    <input
                      v-model.number="merchantSettings.delivery_per_km_fee"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      class="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                    />
                    <span class="text-xs text-gray-600 whitespace-nowrap"
                      >元/km</span
                    >
                  </div>
                </div>

                <!-- 最大外送距離 -->
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">最大距離</h4>
                    <p class="text-xs text-gray-500">最大外送範圍，0為無限制</p>
                  </div>
                  <div
                    class="flex items-center space-x-2 min-w-[120px] justify-end"
                  >
                    <input
                      v-model.number="merchantSettings.max_delivery_distance"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0"
                      class="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                    />
                    <span class="text-xs text-gray-600 w-4">km</span>
                  </div>
                </div>

                <!-- 預先收款 -->
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">預先收款</h4>
                    <p class="text-xs text-gray-500">
                      強制預收款項( ❌ 現場付款 ⭕️ LINEPAY ⭕️ 轉帳 )
                    </p>
                  </div>
                  <div class="flex items-center min-w-[120px] justify-end">
                    <label class="flex items-center cursor-pointer">
                      <input
                        v-model="merchantSettings.delivery_prepayment"
                        type="checkbox"
                        :true-value="1"
                        :false-value="0"
                        class="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-xs text-gray-600">啟用</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 統計資訊 -->
      <div
        class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold">顧客點餐連結</h3>
            <p class="text-green-100 text-sm mt-1">分享給顧客進行點餐</p>
          </div>
          <button
            @click="copyOrderLink"
            class="bg-white/20 hover:bg-white/30 rounded-lg p-3 transition-colors"
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        <div class="mt-4 p-3 bg-white/10 rounded-lg">
          <p class="text-sm font-mono break-all">{{ orderLink }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 時間格式化函數，確保格式為 HH:MM:SS
const formatTimeForDb = (timeString) => {
  if (!timeString) return null;
  // 如果已經是 HH:MM:SS 格式，直接返回前8個字符
  if (timeString.length >= 8 && timeString.includes(':')) {
    return timeString.slice(0, 8);
  }
  // 如果是 HH:MM 格式，添加 :00
  if (timeString.length === 5 && timeString.includes(':')) {
    return timeString + ':00';
  }
  // 其他情況，嘗試解析並格式化
  return timeString.slice(0, 8);
};

const merchantInfo = ref({
  name: '',
  store_name: '',
  phone: '',
  email: '',
  store_description: '',
  lineId: '',
  is_active: 1,
  order_service_active: 0,
});

// 訂單統計相關變數
const orderStats = ref({
  totalOrders: 0,
  totalRevenue: 0,
});

const animatedOrderCount = ref(0);
const animatedRevenue = ref(0);

const merchantSettings = ref({
  available_dining_types: ['takeaway'],
  available_payment_methods: ['cash'],
  advance_discount_rate: 0,
  delivery_minimum_amount: 0,
  delivery_base_fee: 0,
  delivery_free_km: 0,
  delivery_per_km_fee: 0,
  delivery_prepayment: 0,
  max_delivery_distance: 0,
});

const isBusinessOpen = ref(true);
const isOrderServiceOpen = ref(false); // 訂餐服務開關狀態
const showOrderSettings = ref(false);
const isEditing = ref(false); // 追蹤是否在編輯模式
const originalSettings = ref({}); // 保存原始設定值以供取消時還原

// 營業時間相關變數
const showBusinessHours = ref(false);
const isEditingHours = ref(false);
const businessHours = ref({});
const specialHours = ref([]);
const originalBusinessHours = ref({});
const originalSpecialHours = ref([]);

// 星期對照
const weekDays = [
  {name: '週日', value: 0},
  {name: '週一', value: 1},
  {name: '週二', value: 2},
  {name: '週三', value: 3},
  {name: '週四', value: 4},
  {name: '週五', value: 5},
  {name: '週六', value: 6},
];

const orderLink = computed(() => {
  if (merchantInfo.value.lineId) {
    return `${window.location.origin}/menu/${merchantInfo.value.lineId}/login`;
  }
  return '設定完成後顯示';
});

// 檢查是否有 LINE Pay 設定
const hasLinePaySettings = computed(() => {
  return (
    merchantInfo.value.linePay_channel_id &&
    merchantInfo.value.linePay_secret_key
  );
});

// 載入商家資訊
const loadMerchantInfo = async () => {
  try {
    const {data} = await $fetch('/api/merchant/info');
    console.log('Loaded merchant data:', data); // 調試信息
    merchantInfo.value = data;
    isBusinessOpen.value = data.is_active === 1;
    isOrderServiceOpen.value = data.order_service_active === 1;

    console.log('Status values:', {
      // 調試信息
      is_active: data.is_active,
      order_service_active: data.order_service_active,
      isBusinessOpen: isBusinessOpen.value,
      isOrderServiceOpen: isOrderServiceOpen.value,
    });

    // 載入商家設定
    merchantSettings.value = {
      available_dining_types: data.available_dining_types || ['takeaway'],
      available_payment_methods: data.available_payment_methods || ['cash'],
      advance_discount_rate: data.advance_discount_rate || 0,
      delivery_minimum_amount: data.delivery_minimum_amount || 0,
      delivery_base_fee: data.delivery_base_fee || 0,
      delivery_free_km: data.delivery_free_km || 0,
      delivery_per_km_fee: data.delivery_per_km_fee || 0,
      delivery_prepayment: data.delivery_prepayment || 0,
      max_delivery_distance: data.max_delivery_distance || 0,
    };
  } catch (error) {
    console.error('Failed to load merchant info:', error);
  }
};

// 載入訂單統計資料
const loadOrderStats = async () => {
  try {
    const {data} = await $fetch('/api/merchant/order-statistics');
    orderStats.value = data;

    // 觸發動畫計數器
    startCountAnimation();
  } catch (error) {
    console.error('Failed to load order statistics:', error);
  }
};

// 動畫計數器
const startCountAnimation = () => {
  const targetOrders = orderStats.value.totalOrders;
  const targetRevenue = orderStats.value.totalRevenue;

  // 重置計數器
  animatedOrderCount.value = 0;
  animatedRevenue.value = 0;

  // 計算動畫持續時間和步驟
  const duration = 2000; // 2秒
  const steps = 60; // 60步
  const interval = duration / steps;

  const orderStep = targetOrders / steps;
  const revenueStep = targetRevenue / steps;

  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep++;

    if (currentStep <= steps) {
      animatedOrderCount.value = Math.min(
        Math.floor(orderStep * currentStep),
        targetOrders
      );
      animatedRevenue.value = Math.min(
        Math.floor(revenueStep * currentStep),
        targetRevenue
      );
    }

    if (currentStep >= steps) {
      // 確保最終值準確
      animatedOrderCount.value = targetOrders;
      animatedRevenue.value = targetRevenue;
      clearInterval(timer);
    }
  }, interval);
};

// 前往 LINE 使用量說明頁面
const goToLineUsage = () => {
  navigateTo('/admin/line-usage');
};

// 更新商家設定
const updateSettings = async () => {
  try {
    await $fetch('/api/merchant/setup', {
      method: 'POST',
      body: {
        ...merchantInfo.value,
        available_dining_types: merchantSettings.value.available_dining_types,
        available_payment_methods:
          merchantSettings.value.available_payment_methods,
        advance_discount_rate: merchantSettings.value.advance_discount_rate,
        delivery_minimum_amount: merchantSettings.value.delivery_minimum_amount,
        delivery_base_fee: merchantSettings.value.delivery_base_fee,
        delivery_free_km: merchantSettings.value.delivery_free_km,
        delivery_per_km_fee: merchantSettings.value.delivery_per_km_fee,
        delivery_prepayment: merchantSettings.value.delivery_prepayment,
        max_delivery_distance: merchantSettings.value.max_delivery_distance,
      },
    });
  } catch (error) {
    console.error('Failed to update merchant settings:', error);
    alert('設定更新失敗，請稍後再試');
  }
};

// 開始編輯
const startEditing = () => {
  // 保存原始設定值
  originalSettings.value = {
    available_dining_types: [...merchantSettings.value.available_dining_types],
    available_payment_methods: [
      ...merchantSettings.value.available_payment_methods,
    ],
    advance_discount_rate: merchantSettings.value.advance_discount_rate,
    delivery_minimum_amount: merchantSettings.value.delivery_minimum_amount,
    delivery_base_fee: merchantSettings.value.delivery_base_fee,
    delivery_free_km: merchantSettings.value.delivery_free_km,
    delivery_per_km_fee: merchantSettings.value.delivery_per_km_fee,
    delivery_prepayment: merchantSettings.value.delivery_prepayment,
    max_delivery_distance: merchantSettings.value.max_delivery_distance,
  };
  isEditing.value = true;
};

// 取消編輯
const cancelEditing = () => {
  // 還原原始設定值
  merchantSettings.value = {
    available_dining_types: [...originalSettings.value.available_dining_types],
    available_payment_methods: [
      ...originalSettings.value.available_payment_methods,
    ],
    advance_discount_rate: originalSettings.value.advance_discount_rate,
    delivery_minimum_amount: originalSettings.value.delivery_minimum_amount,
    delivery_base_fee: originalSettings.value.delivery_base_fee,
    delivery_free_km: originalSettings.value.delivery_free_km,
    delivery_per_km_fee: originalSettings.value.delivery_per_km_fee,
    delivery_prepayment: originalSettings.value.delivery_prepayment,
    max_delivery_distance: originalSettings.value.max_delivery_distance,
  };
  isEditing.value = false;
};

// 保存所有設定
const saveAllSettings = async () => {
  try {
    // 檢查銀行轉帳設定
    if (
      merchantSettings.value.available_payment_methods.includes('bank_transfer')
    ) {
      if (
        !merchantInfo.value.bank_account ||
        merchantInfo.value.bank_account.trim() === ''
      ) {
        alert('請先在「進階設定」中設定收款帳號，才能提供銀行轉帳付款方式');
        return;
      }
    }

    await updateSettings();
    isEditing.value = false;
  } catch (error) {
    console.error('保存設定失敗:', error);
    alert('保存設定失敗，請稍後再試');
  }
};

// 切換外送服務
const toggleDeliveryService = (event) => {
  const isChecked = event.target.checked;
  if (isChecked) {
    // 開啟外送服務
    if (!merchantSettings.value.available_dining_types.includes('delivery')) {
      merchantSettings.value.available_dining_types.push('delivery');
    }
  } else {
    // 關閉外送服務
    merchantSettings.value.available_dining_types =
      merchantSettings.value.available_dining_types.filter(
        (type) => type !== 'delivery'
      );
  }
};

// 取得用餐方式顯示文字
const getDiningTypesDisplay = () => {
  const types = merchantSettings.value.available_dining_types || [];
  const typeMap = {
    takeaway: '外帶',
    'dine-in': '內用',
    delivery: '外送',
  };

  if (types.length === 0) return '未設定';
  return types.map((type) => typeMap[type] || type).join('、');
};

// 取得支付方式顯示文字
const getPaymentMethodsDisplay = () => {
  const methods = merchantSettings.value.available_payment_methods || [];
  const methodMap = {
    cash: '現場付款',
    bank_transfer: '銀行轉帳',
    mobile: '行動支付',
  };

  if (methods.length === 0) return '未設定';
  return methods.map((method) => methodMap[method] || method).join('、');
};

// 檢查銀行轉帳是否可用
const isBankTransferAvailable = computed(() => {
  return (
    merchantInfo.value.bank_account &&
    merchantInfo.value.bank_account.trim() !== ''
  );
});

// 檢查是否選擇了銀行轉帳但沒有設定帳號
const hasBankTransferWithoutAccount = computed(() => {
  return (
    merchantSettings.value.available_payment_methods.includes(
      'bank_transfer'
    ) && !isBankTransferAvailable.value
  );
});

// 登出功能
const logout = async () => {
  try {
    await $fetch('/api/auth/logout', {method: 'POST'});
    await navigateTo('/admin/login');
  } catch (error) {
    console.error('Logout failed:', error);
    // 強制重定向
    await navigateTo('/');
  }
};

// 前往設定頁面
const goToSettings = () => {
  navigateTo('/admin/settings');
};

// 前往商品管理
const goToProducts = () => {
  navigateTo('/admin/products');
};

// 複製點餐連結
const copyOrderLink = async () => {
  try {
    await navigator.clipboard.writeText(orderLink.value);
    alert('連結已複製到剪貼簿');
  } catch (error) {
    console.error('Copy failed:', error);
    alert('複製失敗，請手動複製');
  }
};

// 前往店家資訊頁面
const goToStoreInfo = () => {
  navigateTo('/admin/store-info');
};

// 取得店家名稱首字母
const getStoreInitial = (storeName) => {
  if (!storeName) return '店';
  return storeName.charAt(0).toUpperCase();
};

// 切換營業狀態
const toggleBusinessStatus = async () => {
  try {
    const newIsActive = isBusinessOpen.value ? 1 : 0;

    // 使用專門的狀態更新 API，並設置手動控制標記
    await $fetch('/api/merchant/update-active-status', {
      method: 'POST',
      body: {
        is_active: newIsActive,
        manual_override: true, // 設置為手動控制
      },
    });

    // 更新本地狀態
    merchantInfo.value.is_active = newIsActive;
    merchantInfo.value.manual_override_until_midnight = 1;

    // 如果關閉營業，自動打開訂餐服務
    if (newIsActive === 0) {
      const orderServiceBody = {
        ...merchantInfo.value,
        order_service_active: 1,
      };

      await $fetch('/api/merchant/setup', {
        method: 'POST',
        body: orderServiceBody,
      });

      merchantInfo.value.order_service_active = 1;
      isOrderServiceOpen.value = true;
    }

    console.log(
      'Business status manually updated to:',
      newIsActive ? 'open' : 'closed'
    );
  } catch (error) {
    console.error('Failed to update business status:', error);
    // 如果更新失敗，還原狀態
    isBusinessOpen.value = !isBusinessOpen.value;
    if (newIsActive === 0) {
      isOrderServiceOpen.value = false;
    }
    alert('營業狀態更新失敗，請稍後再試');
  }
};

// 切換訂餐服務狀態
const toggleOrderService = async () => {
  try {
    const newOrderServiceActive = isOrderServiceOpen.value ? 1 : 0;
    console.log('Toggling order service to:', newOrderServiceActive); // 調試信息

    await $fetch('/api/merchant/setup', {
      method: 'POST',
      body: {
        ...merchantInfo.value,
        order_service_active: newOrderServiceActive,
      },
    });

    merchantInfo.value.order_service_active = newOrderServiceActive;
    console.log('Order service updated successfully'); // 調試信息
  } catch (error) {
    console.error('Failed to update order service status:', error);
    // 如果更新失敗，還原狀態
    isOrderServiceOpen.value = !isOrderServiceOpen.value;
    alert('訂餐服務狀態更新失敗，請稍後再試');
  }
};

useHead({
  title: computed(() =>
    merchantInfo.value.store_name
      ? `thankQ儀表板 - ${merchantInfo.value.store_name}`
      : 'thankQ儀表板'
  ),
  meta: [
    {
      name: 'description',
      content: computed(
        () => merchantInfo.value.store_description || 'thankQ儀表板'
      ),
    },
  ],
});

// 營業時間相關函數
const loadBusinessHours = async () => {
  try {
    const {data} = await $fetch('/api/merchant/business-hours');
    console.log('Loaded business hours data:', data);

    // 初始化營業時間物件
    const hours = {};
    for (let i = 0; i <= 6; i++) {
      const found = data.businessHours.find((h) => h.day_of_week === i);
      hours[i] = found
        ? {
            is_open: found.is_open,
            open_time: found.open_time ? found.open_time.slice(0, 5) : '09:00',
            close_time: found.close_time
              ? found.close_time.slice(0, 5)
              : '18:00',
            break_start_time: found.break_start_time
              ? found.break_start_time.slice(0, 5)
              : null,
            break_end_time: found.break_end_time
              ? found.break_end_time.slice(0, 5)
              : null,
          }
        : {
            is_open: false,
            open_time: '09:00',
            close_time: '18:00',
            break_start_time: null,
            break_end_time: null,
          };
    }

    businessHours.value = hours;

    // 按日期排序休假日期（最早的在上面）
    const sortedSpecialHours = (data.specialHours || []).sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    console.log('Setting special hours:', sortedSpecialHours);
    specialHours.value = sortedSpecialHours;
  } catch (error) {
    console.error('Failed to load business hours:', error);
  }
};

const startEditingHours = async () => {
  // 重新載入最新數據以確保同步
  await loadBusinessHours();

  // 保存原始數據
  originalBusinessHours.value = JSON.parse(JSON.stringify(businessHours.value));
  originalSpecialHours.value = JSON.parse(JSON.stringify(specialHours.value));
  isEditingHours.value = true;
};

const cancelEditingHours = () => {
  // 還原原始數據
  businessHours.value = JSON.parse(JSON.stringify(originalBusinessHours.value));
  specialHours.value = JSON.parse(JSON.stringify(originalSpecialHours.value));
  isEditingHours.value = false;
};

const saveBusinessHours = async () => {
  try {
    // 驗證休假日期
    for (const special of specialHours.value) {
      if (!special.id) {
        // 只驗證新增的項目
        if (!special.date) {
          alert('❌ 請選擇休假日期');
          return;
        }
        if (!special.reason || special.reason.trim() === '') {
          alert('❌ 請填寫休假原因');
          return;
        }
        // 驗證日期必須是今天以後（包含今天）
        const selectedDate = new Date(special.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          alert('❌ 休假日期不能是過去的日期');
          return;
        }

        // 檢查日期是否重複
        const existingDates = specialHours.value
          .filter(
            (s, i) =>
              i !== specialHours.value.findIndex((item) => item === special)
          ) // 排除自己
          .map((s) => s.date);

        if (existingDates.includes(special.date)) {
          alert('❌ 休假日期不能重複');
          return;
        }
      }
    }

    // 轉換格式以符合API需求
    const businessHoursArray = Object.keys(businessHours.value).map(
      (dayOfWeek) => ({
        day_of_week: parseInt(dayOfWeek),
        is_open: businessHours.value[dayOfWeek].is_open,
        open_time: businessHours.value[dayOfWeek].is_open
          ? formatTimeForDb(businessHours.value[dayOfWeek].open_time)
          : null,
        close_time: businessHours.value[dayOfWeek].is_open
          ? formatTimeForDb(businessHours.value[dayOfWeek].close_time)
          : null,
        break_start_time: businessHours.value[dayOfWeek].break_start_time
          ? formatTimeForDb(businessHours.value[dayOfWeek].break_start_time)
          : null,
        break_end_time: businessHours.value[dayOfWeek].break_end_time
          ? formatTimeForDb(businessHours.value[dayOfWeek].break_end_time)
          : null,
      })
    );

    const specialHoursArray = specialHours.value.map((special) => ({
      id: special.id,
      date: special.date,
      is_open: false, // 休假日期固定為關閉
      open_time: null,
      close_time: null,
      reason: special.reason,
    }));

    await $fetch('/api/merchant/business-hours', {
      method: 'POST',
      body: {
        businessHours: businessHoursArray,
        specialHours: specialHoursArray,
      },
    });

    // 重新載入資料以確保排序正確
    await loadBusinessHours();

    isEditingHours.value = false;
    alert('營業時間設定已保存');
  } catch (error) {
    console.error('Failed to save business hours:', error);
    alert('保存失敗，請稍後再試');
  }
};

const addSpecialHour = () => {
  const today = new Date();

  specialHours.value.push({
    date: today.toISOString().substring(0, 10),
    is_open: false,
    open_time: null,
    close_time: null,
    reason: '',
  });
};

const removeSpecialHour = (index) => {
  specialHours.value.splice(index, 1);
};

// 刪除已保存的休假日期
const deleteSpecialHour = async (specialId, index) => {
  if (!specialId) {
    // 如果沒有 ID，直接從陣列中移除（未保存的項目）
    specialHours.value.splice(index, 1);
    return;
  }

  if (!confirm('確定要刪除這個休假日期嗎？')) {
    return;
  }

  try {
    await $fetch(`/api/merchant/special-hours/${specialId}`, {
      method: 'DELETE',
    });

    // 重新載入資料以確保與資料庫同步
    await loadBusinessHours();

    alert('🗑️ 休假日期已刪除');
  } catch (error) {
    console.error('Failed to delete special hour:', error);
    alert('❌ 刪除失敗，請稍後再試');
  }
};

// 獲取今天日期（用於日期輸入的最小值）
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().substring(0, 10);
};

const getBusinessHourDisplay = (dayOfWeek) => {
  const hour = businessHours.value[dayOfWeek];
  if (!hour || !hour.is_open) {
    return '休息';
  }
  if (!hour.open_time || !hour.close_time) {
    return '全天營業';
  }
  return `${hour.open_time} - ${hour.close_time}`;
};

const getSpecialHourDisplay = (special) => {
  return '休假';
};

const formatSpecialDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
};

// 即時更新商家營業狀態
const updateMerchantActiveStatus = async () => {
  try {
    // 檢查是否為新的一天，如果是則重置手動控制標記
    await resetManualOverrideIfNeeded();

    // 如果商家設定了手動控制，則不進行自動狀態更新
    if (merchantInfo.value.manual_override_until_midnight === 1) {
      console.log('Manual override is active, skipping auto status update');
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

    const isHoliday = specialHours.value.some((special) => {
      const specialDate = new Date(special.date);
      specialDate.setHours(0, 0, 0, 0);
      return specialDate.getTime() === today.getTime() && !special.is_open;
    });

    // 如果是休假日，設為關閉
    if (isHoliday) {
      if (merchantInfo.value.is_active !== 0) {
        await $fetch('/api/merchant/update-active-status', {
          method: 'POST',
          body: {is_active: 0},
        });
        merchantInfo.value.is_active = 0;
      }
      return;
    }

    // 檢查當前時間是否在營業時間內
    const businessHour = businessHours.value[currentDay];
    let shouldBeActive = false;

    if (
      businessHour &&
      businessHour.is_open &&
      businessHour.open_time &&
      businessHour.close_time
    ) {
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
          shouldBeActive =
            currentTimeInMinutes >= openTimeInMinutes ||
            currentTimeInMinutes <= closeTimeInMinutes;
        }
      } else {
        // 一般營業時間
        shouldBeActive =
          currentTimeInMinutes >= openTimeInMinutes &&
          currentTimeInMinutes <= closeTimeInMinutes;
      }
    }

    // 更新狀態（如果有變化）
    const newActiveStatus = shouldBeActive ? 1 : 0;
    if (merchantInfo.value.is_active !== newActiveStatus) {
      await $fetch('/api/merchant/update-active-status', {
        method: 'POST',
        body: {is_active: newActiveStatus},
      });
      merchantInfo.value.is_active = newActiveStatus;
      isBusinessOpen.value = newActiveStatus === 1;
    }
  } catch (error) {
    console.error('Failed to update merchant active status:', error);
  }
};

// 檢查是否需要重置手動控制標記（新的一天）
const resetManualOverrideIfNeeded = async () => {
  try {
    const response = await $fetch('/api/merchant/reset-manual-override', {
      method: 'POST',
    });

    // 無論是否重置，都要重新載入商家資訊以獲取最新的 manual_override 狀態
    const {data} = await $fetch('/api/merchant/info');
    merchantInfo.value.manual_override_until_midnight =
      data.manual_override_until_midnight;

    if (response.reset) {
      console.log('Manual override was reset for new day');
    }
  } catch (error) {
    console.error('Failed to reset manual override:', error);
  }
};

// 頁面載入時取得商家資訊
onMounted(async () => {
  await loadMerchantInfo();
  await loadBusinessHours();
  await loadOrderStats(); // 載入訂單統計
  // 載入完成後檢查並更新營業狀態
  await updateMerchantActiveStatus();
});
</script>
