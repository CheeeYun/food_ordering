<!-- 客戶認證中間件 -->
<script>
definePageMeta({
  middleware: 'customer-auth',
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 載入狀態 -->
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
      ></div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="flex items-center justify-center h-screen">
      <div class="text-center">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="retryLoad"
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          重試
        </button>
      </div>
    </div>

    <!-- 菜單頁面 -->
    <div v-else>
      <!-- Header - 店家資訊 -->
      <div
        class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40"
      >
        <div class="px-4 py-3 grid grid-cols-3 items-center">
          <!-- 左側：Logo -->
          <div class="flex items-center justify-start">
            <img class="max-w-20" src="/logoType.png" />
          </div>

          <!-- 中央：店名和營業狀態 -->
          <div class="flex flex-col items-center justify-center text-center">
            <button
              @click="showStoreInfo = true"
              class="hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <h1 class="font-semibold text-gray-900 text-sm">
                {{ merchantInfo.store_name || '店家' }}
              </h1>
              <div class="flex items-center justify-center space-x-2">
                <div
                  v-if="merchantInfo.is_active"
                  class="inline-flex items-center text-xs text-green-600"
                >
                  <div class="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  營業中
                </div>
                <div
                  v-else
                  class="inline-flex items-center text-xs text-red-600"
                >
                  <div class="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  已關閉
                </div>
              </div>
            </button>
          </div>

          <!-- 右側：購物車按鈕 -->
          <div class="flex items-center justify-end">
            <button
              @click="
                (merchantInfo.is_active ||
                  (merchantInfo.order_service_active &&
                    isAdvanceOrderingMode)) &&
                  (showCart = true)
              "
              :disabled="
                !merchantInfo.is_active &&
                !(merchantInfo.order_service_active && isAdvanceOrderingMode)
              "
              class="relative text-white p-2 rounded-full"
              :class="{
                'bg-orange-400 hover:bg-blue-600 cursor-pointer':
                  merchantInfo.is_active ||
                  (merchantInfo.order_service_active && isAdvanceOrderingMode),
                'bg-gray-400 cursor-not-allowed':
                  !merchantInfo.is_active &&
                  !(merchantInfo.order_service_active && isAdvanceOrderingMode),
                'animate-pulse':
                  cartItems.length > 0 &&
                  (merchantInfo.is_active ||
                    (merchantInfo.order_service_active &&
                      isAdvanceOrderingMode)),
              }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="M5 7a1 1 0 0 0 0 2h2.22l2.624 10.5c.223.89 1.02 1.5 1.937 1.5h11.47c.903 0 1.67-.6 1.907-1.47L27.75 10H11l.5 2h13.656l-1.906 7H11.78L9.157 8.5A1.984 1.984 0 0 0 7.22 7zm17 14c-1.645 0-3 1.355-3 3s1.355 3 3 3s3-1.355 3-3s-1.355-3-3-3m-9 0c-1.645 0-3 1.355-3 3s1.355 3 3 3s3-1.355 3-3s-1.355-3-3-3m0 2c.564 0 1 .436 1 1s-.436 1-1 1s-1-.436-1-1s.436-1 1-1m9 0c.564 0 1 .436 1 1s-.436 1-1 1s-1-.436-1-1s.436-1 1-1"
                />
              </svg>
              <span
                v-if="cartItemCount > 0"
                class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ cartItemCount }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- 店家關閉遮罩 -->
      <div
        v-if="!merchantInfo.is_active && !isAdvanceOrderingMode"
        class="fixed inset-0 backdrop-blur-sm z-30"
        style="top: 88px"
      >
        <div class="backdrop-blur-sm h-full flex items-center justify-center">
          <div class="bg-white rounded-xl p-8 mx-4 text-center shadow-2xl">
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
            <h3 class="text-xl font-bold text-gray-900">店家已關閉</h3>
            <p class="text-gray-600 mb-4">目前不開放線上點餐服務</p>
            <p class="text-sm text-gray-500">請於營業時間內再次光臨</p>
            <p class="text-sm text-blue-500 mb-3">點擊「店名」查看商家資訊</p>

            <!-- 根據訂餐服務狀態顯示不同按鈕 -->
            <div v-if="merchantInfo.order_service_active">
              <!-- 訂餐服務開啟時顯示預訂按鈕 -->
              <button
                @click="enableAdvanceOrdering"
                class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                👉 預訂餐點
              </button>
              <p class="text-xs text-green-600 mt-2">可預訂隔日或未來餐點</p>
            </div>
            <div v-else>
              <!-- 訂餐服務關閉時顯示提示 -->
              <div class="text-gray-500">
                <p class="text-sm">暫時無法接受預訂服務</p>
                <p class="text-xs mt-1">請稍後再試或聯繫店家</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分類頁籤 -->
      <div
        v-if="
          categories.length > 1 &&
          (merchantInfo.is_active ||
            (merchantInfo.order_service_active && isAdvanceOrderingMode))
        "
        class="bg-white border-b border-gray-200 px-4 py-2"
      >
        <div class="flex space-x-4 overflow-x-auto">
          <button
            v-for="category in categories"
            :key="category"
            @click="activeCategory = category"
            :class="{
              'text-blue-600 border-b-2 border-blue-600':
                activeCategory === category,
              'text-gray-600': activeCategory !== category,
            }"
            class="whitespace-nowrap pb-2 px-1 text-sm font-medium"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="px-4 py-4">
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg
              class="w-16 h-16 mx-auto"
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
          <h3 class="text-lg font-medium text-gray-900 mb-2">暫無商品</h3>
          <p class="text-gray-500">此分類目前沒有商品</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative"
          >
            <!-- 限時特價標籤 - 右上角 -->
            <div
              v-if="product.sale_price && Number(product.sale_price) > 0"
              class="absolute -top-3 -right-3 z-10 transform rotate-12"
            >
              <span
                class="text-red-400 text-sm px-4 py-2 rounded-full font-black animate-bounce shadow-2xl border-2 border-red-300"
              >
                限時特價
              </span>
            </div>

            <div class="flex items-start space-x-4">
              <!-- 商品圖片 -->
              <div
                class="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden"
              >
                <img
                  v-if="product.image_url"
                  :src="product.image_url"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <svg
                    class="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              <!-- 商品資訊 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-1">
                  <h3 class="font-semibold text-lg text-gray-900">
                    {{ product.name }}
                    <span
                      v-if="product.count > 0"
                      class="text-sm text-gray-500 font-normal"
                    >
                      ({{ product.count > 1000 ? '1000+' : product.count }})
                    </span>
                  </h3>
                  <!-- 人氣徽章 -->
                  <div
                    v-if="getPopularityBadge(product)"
                    class="flex items-center"
                  >
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                      :class="getPopularityBadge(product).class"
                    >
                      {{ getPopularityBadge(product).icon }}
                      {{ getPopularityBadge(product).text }}
                    </span>
                  </div>
                </div>
                <p
                  v-if="product.description"
                  class="text-sm text-gray-600 mb-2 line-clamp-2"
                >
                  {{ product.description }}
                </p>
                <div class="flex items-center justify-between">
                  <!-- 價格顯示 -->
                  <div class="flex items-center space-x-2">
                    <!-- 如果有特價，顯示特價和原價槓掉 -->
                    <template
                      v-if="
                        product.sale_price && Number(product.sale_price) > 0
                      "
                    >
                      <span
                        class="text-2xl font-bold text-red-500 animate-pulse"
                      >
                        ${{ Number(product.sale_price).toFixed(0) }}
                      </span>
                      <span class="text-sm text-gray-500 line-through">
                        原價 ${{ Number(product.price).toFixed(0) }}
                      </span>
                    </template>
                    <!-- 沒有特價，顯示原價 -->
                    <template v-else>
                      <span class="text-lg font-bold text-blue-500">
                        ${{ Number(product.price).toFixed(0) }}
                      </span>
                    </template>
                  </div>

                  <!-- 加入購物車按鈕 -->
                  <button
                    v-if="
                      product.is_active &&
                      (merchantInfo.is_active ||
                        (merchantInfo.order_service_active &&
                          isAdvanceOrderingMode))
                    "
                    @click="openProductModal(product)"
                    class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    + 加入
                  </button>
                  <button
                    v-else-if="
                      !merchantInfo.is_active &&
                      !(
                        merchantInfo.order_service_active &&
                        isAdvanceOrderingMode
                      )
                    "
                    disabled
                    class="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                  >
                    已關閉
                  </button>
                  <button
                    v-else
                    disabled
                    class="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                  >
                    缺貨
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品選項 Modal -->
      <div
        v-if="showProductModal"
        class="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center p-4 z-50"
      >
        <div
          class="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">
                加入購物車 - {{ selectedProduct.name }}
              </h3>
              <button
                @click="closeProductModal"
                class="text-gray-400 hover:text-gray-600"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div
              v-if="selectedProduct.description"
              class="text-gray-600 text-sm mb-4"
            >
              {{ selectedProduct.description }}
            </div>

            <!-- 選項群組列表 -->
            <div
              v-if="
                selectedProduct.optionGroups &&
                selectedProduct.optionGroups.length > 0
              "
              class="mb-6"
            >
              <div
                v-for="group in selectedProduct.optionGroups"
                :key="group.id"
                class="mb-6"
              >
                <h4 class="font-medium mb-3">
                  {{ group.name }}
                  <span v-if="group.is_required" class="text-red-500 text-sm"
                    >*必選</span
                  >
                  <span
                    v-if="group.selection_type === 'multiple'"
                    class="text-blue-500 text-sm ml-1"
                    >(可複選)</span
                  >
                </h4>

                <div class="space-y-2">
                  <label
                    v-for="option in group.options"
                    :key="option.id"
                    class="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    :class="{
                      'border-blue-500 bg-blue-50': isOptionSelected(
                        group,
                        option
                      ),
                    }"
                    @click="selectGroupOption(group, option)"
                  >
                    <div class="flex items-center">
                      <input
                        v-if="group.selection_type === 'single'"
                        type="radio"
                        :name="`group-${group.id}`"
                        :checked="isOptionSelected(group, option)"
                        class="mr-3"
                        @click.stop
                      />
                      <input v-else type="checkbox" class="mr-3" />
                      <span>{{ option.name }}</span>
                    </div>
                    <span class="font-medium">
                      +${{ Number(option.price).toFixed(0) }}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 傳統選項列表（向後相容） -->
            <div
              v-if="
                selectedProduct.options && selectedProduct.options.length > 0
              "
              class="mb-6"
            >
              <h4 class="font-medium mb-3">加購項目（可選）：</h4>
              <div class="space-y-2">
                <label
                  v-for="option in selectedProduct.options"
                  :key="option.id"
                  class="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  :class="{
                    'border-blue-500 bg-blue-50':
                      selectedOption?.id === option.id,
                  }"
                >
                  <div class="flex items-center">
                    <input
                      type="radio"
                      :value="option"
                      v-model="selectedOption"
                      class="mr-3"
                    />
                    <span>{{ option.name }}</span>
                  </div>
                  <span class="font-medium">
                    +${{ Number(option.price).toFixed(0) }}
                  </span>
                </label>
              </div>
            </div>

            <!-- 價格和數量 -->
            <div class="flex items-center justify-between mb-6">
              <div class="text-xl font-bold text-blue-600">
                ${{ totalPrice }}
              </div>
              <div class="flex items-center space-x-3">
                <button
                  @click="quantity = Math.max(1, quantity - 1)"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span class="w-8 text-center">{{ quantity }}</span>
                <button
                  @click="quantity++"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <!-- 加入購物車按鈕 -->
            <button
              @click="addToCartWithOptions"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>

      <!-- 購物車 Modal -->
      <div
        v-if="showCart"
        class="fixed inset-0 bg-transparent backdrop-blur-xs flex items-end justify-center z-50 md:items-center md:p-4"
      >
        <div
          class="bg-white w-full max-h-[80vh] overflow-y-auto md:max-w-md md:rounded-xl"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">購物車</h3>
              <button
                @click="showCart = false"
                class="text-gray-400 hover:text-gray-600"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div v-if="cartItems.length === 0" class="text-center py-8">
              <svg
                class="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"
                />
              </svg>
              <p class="text-gray-500">購物車是空的</p>
            </div>

            <div v-else>
              <!-- 購物車商品列表 -->
              <div class="space-y-4 mb-6">
                <div
                  v-for="item in cartItems"
                  :key="item.cartId"
                  class="flex items-center justify-between py-3 border-b border-gray-100"
                >
                  <div class="flex-1">
                    <h4 class="font-medium">{{ item.name }}</h4>

                    <!-- 顯示選項群組選擇 -->
                    <div
                      v-if="
                        item.selectedGroupOptions &&
                        Object.keys(item.selectedGroupOptions).length > 0
                      "
                      class="text-sm text-gray-600"
                    >
                      <div
                        v-for="(
                          groupData, groupId
                        ) in item.selectedGroupOptions"
                        :key="groupId"
                        class="mb-1"
                      >
                        <span class="font-medium"
                          >{{ groupData.groupName }}:</span
                        >
                        <span class="ml-1">{{
                          groupData.selectedOptions
                            .map((opt) => opt.name)
                            .join(', ')
                        }}</span>
                      </div>
                    </div>

                    <!-- 向後相容：顯示傳統選項 -->
                    <p
                      v-else-if="item.selectedOption"
                      class="text-sm text-gray-600"
                    >
                      規格: {{ item.selectedOption.name }}
                    </p>

                    <!-- 顯示選項描述（如果有的話） -->
                    <p
                      v-else-if="item.optionDescription"
                      class="text-sm text-gray-600"
                    >
                      {{ item.optionDescription }}
                    </p>

                    <p class="text-sm text-red-400">
                      ${{ item.totalPrice }} × {{ item.quantity }}
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="updateCartItemQuantity(item, item.quantity - 1)"
                      class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span class="w-8 text-center text-sm">{{
                      item.quantity
                    }}</span>
                    <button
                      @click="updateCartItemQuantity(item, item.quantity + 1)"
                      class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <!-- 總計 -->
              <div class="border-t border-gray-200 pt-4 mb-6">
                <div
                  class="flex items-center justify-between text-lg font-semibold"
                >
                  <span>總計</span>
                  <span class="text-blue-600">${{ cartTotal }}</span>
                </div>
              </div>

              <!-- 結帳按鈕 -->
              <button
                @click="checkout"
                class="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
              >
                結帳
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 店家資訊 Modal -->
      <div
        v-if="showStoreInfo"
        class="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <div
          class="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">店家資訊</h3>
              <button
                @click="showStoreInfo = false"
                class="text-gray-400 hover:text-gray-600"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- 店家基本資訊 -->
            <div class="space-y-4">
              <!-- 店名 -->
              <div class="text-center mb-6">
                <div
                  class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3"
                >
                  <span class="text-white font-bold text-2xl">{{
                    getStoreInitial(merchantInfo.store_name)
                  }}</span>
                </div>
                <h2 class="text-xl font-bold text-gray-900 mb-2">
                  {{ merchantInfo.store_name || '店家名稱' }}
                </h2>
                <div class="flex items-center justify-center space-x-2">
                  <div
                    v-if="merchantInfo.is_active"
                    class="inline-flex items-center text-sm text-green-600"
                  >
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    營業中
                  </div>
                  <div
                    v-else
                    class="inline-flex items-center text-sm text-red-600"
                  >
                    <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    已關閉
                  </div>
                </div>
              </div>

              <!-- 店家描述 -->
              <div v-if="merchantInfo.store_description" class="mb-4">
                <h4 class="font-medium text-gray-900 mb-2">店家介紹</h4>
                <p
                  class="text-gray-600 text-sm leading-relaxed whitespace-pre-line"
                >
                  {{ merchantInfo.store_description }}
                </p>
              </div>

              <!-- 聯絡資訊 -->
              <div class="space-y-3">
                <div
                  v-if="merchantInfo.phone"
                  class="flex items-center space-x-3"
                >
                  <div
                    class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">電話</p>
                    <p class="font-medium text-gray-900">
                      {{ merchantInfo.phone }}
                    </p>
                  </div>
                </div>

                <div
                  v-if="merchantInfo.address"
                  class="flex items-center space-x-3"
                >
                  <div
                    class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">地址</p>
                    <p class="font-medium text-gray-900">
                      {{ merchantInfo.address }}
                    </p>
                  </div>
                </div>

                <!-- 營業時間 -->
                <div
                  v-if="
                    merchantInfo.business_hours &&
                    merchantInfo.business_hours.length > 0
                  "
                  class="flex items-start space-x-3"
                >
                  <div
                    class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-500 mb-2">營業時間</p>
                    <div class="space-y-1">
                      <div
                        v-for="businessHour in sortedBusinessHours"
                        :key="businessHour.day_of_week"
                        class="flex justify-between text-sm"
                        :class="
                          isToday(businessHour.day_of_week)
                            ? 'font-semibold text-blue-600'
                            : 'text-gray-700'
                        "
                      >
                        <span>{{ getDayName(businessHour.day_of_week) }}</span>
                        <span v-if="businessHour.is_open">
                          {{ formatTime(businessHour.open_time) }} -
                          {{ formatTime(businessHour.close_time) }}
                        </span>
                        <span v-else class="text-red-500">休息</span>
                      </div>
                    </div>

                    <!-- 特殊營業時間 / 休假日 -->
                    <div v-if="upcomingSpecialHours.length > 0" class="mt-3">
                      <p class="text-sm text-gray-500 mb-1">特殊時間</p>
                      <div class="space-y-1">
                        <div
                          v-for="special in upcomingSpecialHours"
                          :key="special.date"
                          class="text-xs"
                          :class="
                            special.is_open ? 'text-blue-600' : 'text-red-600'
                          "
                        >
                          <span class="font-medium">{{
                            formatDate(special.date)
                          }}</span>
                          <span v-if="special.is_open">
                            {{ formatTime(special.open_time) }} -
                            {{ formatTime(special.close_time) }}
                          </span>
                          <span v-else>休假</span>
                          <span v-if="special.reason" class="ml-1"
                            >({{ special.reason }})</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 結帳表單 -->
      <CheckoutForm
        v-if="showCheckoutForm"
        :cart-items="cartItems"
        :cart-total="cartTotal"
        :merchant-id="merchantId"
        :is-advance-ordering-mode="isAdvanceOrderingMode"
        @close="showCheckoutForm = false"
        @order-submitted="handleOrderSubmitted"
      />

      <!-- 訂單成功頁面 -->
      <OrderSuccess
        v-if="showOrderSuccess && currentOrder"
        :order-number="currentOrder.orderNumber"
        :order-data="currentOrder.orderData"
        @close="closeOrderSuccess"
        @new-order="handleNewOrder"
      />
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const merchantId = route.params.merchantId;

const isLoading = ref(true);
const error = ref('');
const merchantInfo = ref({});
const products = ref([]);
const categories = ref(['全部']);
const activeCategory = ref('全部');

// 購物車相關
const cartItems = ref([]);
const showCart = ref(false);

// 店家資訊相關
const showStoreInfo = ref(false);

// 結帳相關
const showCheckoutForm = ref(false);
const showOrderSuccess = ref(false);
const currentOrder = ref(null);

// 商品選項相關
const showProductModal = ref(false);
const selectedProduct = ref({});
const selectedOption = ref(null); // 向後相容舊選項
const selectedOptions = reactive({}); // 新的選項群組選擇 {groupId: [optionId1, optionId2] or optionId}
const quantity = ref(1);

// 預訂模式
const isAdvanceOrderingMode = ref(false);

// 計算屬性
const filteredProducts = computed(() => {
  if (activeCategory.value === '全部') {
    return products.value;
  }
  return products.value.filter(
    (product) => (product.category || '未分類') === activeCategory.value
  );
});

const cartItemCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

const cartTotal = computed(() => {
  return cartItems.value.reduce(
    (total, item) => total + item.totalPrice * item.quantity,
    0
  );
});

// 計算商品總價格（計算屬性）
const totalPrice = computed(() => {
  // 使用特價（如果有的話），否則使用原價
  const basePrice =
    selectedProduct.value.sale_price &&
    Number(selectedProduct.value.sale_price) > 0
      ? Number(selectedProduct.value.sale_price)
      : Number(selectedProduct.value.price || 0);
  let optionPrice = 0;

  // 計算舊選項價格（向後相容）
  if (selectedOption.value) {
    optionPrice += Number(selectedOption.value.price);
  }

  // 計算選項群組價格
  if (selectedProduct.value.optionGroups) {
    selectedProduct.value.optionGroups.forEach((group) => {
      const selected = selectedOptions[group.id];

      if (selected !== null && selected !== undefined) {
        if (group.selection_type === 'single') {
          const option = group.options.find((opt) => opt.id === selected);
          if (option) {
            optionPrice += Number(option.price);
          }
        } else {
          if (Array.isArray(selected)) {
            selected.forEach((optionId) => {
              const option = group.options.find((opt) => opt.id === optionId);
              if (option) {
                optionPrice += Number(option.price);
              }
            });
          }
        }
      }
    });
  }

  return (basePrice + optionPrice) * quantity.value;
});

// 計算人氣徽章
const getPopularityBadge = (product) => {
  const count = product.count || 0;

  if (count >= 1000) {
    return {
      text: '超人氣商品',
      icon: '🔥',
      class:
        'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold shadow-lg animate-pulse border-2 border-yellow-400',
    };
  } else if (count >= 500) {
    return {
      text: '最佳人氣',
      icon: '🥇',
      class:
        'bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-white  shadow-md border-white animate-bounce',
    };
  } else if (count >= 300) {
    return {
      text: '人氣商品',
      icon: '🥈',
      class: 'bg-gradient-to-r from-gray-100 to-gray-400 text-white',
    };
  } else if (count >= 100) {
    return {
      text: '人氣商品',
      icon: '🥉',
      class: 'bg-gradient-to-r from-orange-100 to-orange-300 text-white',
    };
  }

  return null;
};

// 載入商家資訊
const loadMerchantInfo = async () => {
  try {
    const response = await $fetch(`/api/customer/merchant/${merchantId}`);
    merchantInfo.value = response.data;
  } catch (err) {
    console.error('Failed to load merchant info:', err);
    error.value = '無法載入店家資訊';
    throw err;
  }
};

// 載入商品
const loadProducts = async () => {
  try {
    const response = await $fetch(`/api/customer/products/${merchantId}`);
    products.value = response.data || [];

    // 建立分類列表，並按照指定順序排列
    const categorySet = new Set();
    products.value.forEach((product) => {
      if (product.category && product.category.trim() !== '') {
        categorySet.add(product.category);
      }
    });

    // 檢查是否有未分類的商品
    const hasUncategorized = products.value.some(
      (product) => !product.category || product.category.trim() === ''
    );

    // 建立分類陣列：一般分類 -> 未分類 -> 全部
    const orderedCategories = [...Array.from(categorySet)];
    if (hasUncategorized) {
      orderedCategories.push('未分類');
    }
    orderedCategories.push('全部');

    categories.value = orderedCategories;

    // 設定預設選中第一個分類（而不是'全部'）
    if (orderedCategories.length > 0) {
      activeCategory.value = orderedCategories[0];
    }
  } catch (err) {
    console.error('Failed to load products:', err);
    throw err;
  }
};

// 載入所有資料
const loadData = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    await Promise.all([loadMerchantInfo(), loadProducts()]);
  } catch (err) {
    error.value = '載入失敗，請稍後再試';
  } finally {
    isLoading.value = false;
  }
};

const retryLoad = () => {
  loadData();
};

// 工具函數
const getStoreInitial = (storeName) => {
  if (!storeName) return '店';
  return storeName.charAt(0).toUpperCase();
};

// 檢查是否有必填選項群組未選擇
const hasRequiredOptionsSelected = () => {
  if (!selectedProduct.value.optionGroups) return true;

  return selectedProduct.value.optionGroups.every((group) => {
    if (!group.is_required) return true;

    const selected = selectedOptions[group.id];
    if (group.selection_type === 'single') {
      return selected !== undefined && selected !== null;
    } else {
      return selected && selected.length > 0;
    }
  });
};

// 防抖標記
const processingOption = ref(false);

// 選擇選項群組中的選項
const selectGroupOption = async (group, option) => {
  if (processingOption.value) {
    return;
  }

  processingOption.value = true;

  if (group.selection_type === 'single') {
    // 單選：直接設置新的選項ID，如果已選中則取消選擇
    if (selectedOptions[group.id] === option.id) {
      // 如果該選項已被選中且群組不是必填，則取消選擇
      if (!group.is_required) {
        selectedOptions[group.id] = null;
      }
    } else {
      selectedOptions[group.id] = option.id;
    }
  } else {
    // 複選：需要陣列操作
    if (!selectedOptions[group.id]) {
      selectedOptions[group.id] = [];
    }

    const currentArray = selectedOptions[group.id];
    const optionIndex = currentArray.indexOf(option.id);

    if (optionIndex > -1) {
      // 移除選項
      currentArray.splice(optionIndex, 1);
    } else {
      // 添加選項
      currentArray.push(option.id);
    }
  }

  // 短暫延遲後解除鎖定
  setTimeout(() => {
    processingOption.value = false;
  }, 100);
};

// 檢查選項是否被選中
const isOptionSelected = (group, option) => {
  const selected = selectedOptions[group.id];
  const result =
    group.selection_type === 'single'
      ? selected === option.id
      : Array.isArray(selected) && selected.includes(option.id);

  return result;
};

// 購物車功能

// 新的購物車函數支援選項群組
const addToCartWithGroupOptions = (product, optionsData, qty = 1) => {
  // 使用特價（如果有的話），否則使用原價
  const basePrice =
    product.sale_price && Number(product.sale_price) > 0
      ? Number(product.sale_price)
      : Number(product.price);
  let optionPrice = 0;
  let optionDescriptions = [];

  // 計算舊選項價格（向後相容）
  if (optionsData.legacyOption) {
    optionPrice += Number(optionsData.legacyOption.price);
    optionDescriptions.push(optionsData.legacyOption.name);
  }

  // 計算選項群組價格和描述
  Object.values(optionsData.groupOptions).forEach((groupData) => {
    groupData.selectedOptions.forEach((option) => {
      optionPrice += Number(option.price);
      optionDescriptions.push(`${groupData.groupName}: ${option.name}`);
    });
  });

  const totalPrice = basePrice + optionPrice;

  const cartItem = {
    cartId: `${product.id}_${JSON.stringify(optionsData)}_${Date.now()}`,
    productId: product.id,
    name: product.name,
    price: basePrice,
    selectedOption: optionsData.legacyOption, // 向後相容
    selectedGroupOptions: optionsData.groupOptions, // 新的選項群組
    optionDescription: optionDescriptions.join(', '),
    quantity: qty,
    totalPrice: totalPrice,
  };

  cartItems.value.push(cartItem);
};

const openProductModal = (product) => {
  selectedProduct.value = product;
  selectedOption.value = null; // 預設不選擇加購（向後相容）
  // 重置選項群組選擇 - 使用更安全的方式清空響應式對象
  Object.keys(selectedOptions).forEach((key) => {
    selectedOptions[key] = null;
  });
  quantity.value = 1;
  showProductModal.value = true;
};

const closeProductModal = () => {
  showProductModal.value = false;
  selectedProduct.value = {};
  selectedOption.value = null;
  // 重置選項群組選擇 - 使用更安全的方式清空響應式對象
  Object.keys(selectedOptions).forEach((key) => {
    selectedOptions[key] = null;
  });
  quantity.value = 1;
};

const addToCartWithOptions = () => {
  // 檢查必填選項
  if (!hasRequiredOptionsSelected()) {
    alert('請選擇所有必填選項');
    return;
  }

  // 準備選項資料
  const selectedOptionsData = {
    legacyOption: selectedOption.value, // 向後相容
    groupOptions: {}, // 選項群組資料
  };

  // 收集選項群組資料
  if (selectedProduct.value.optionGroups) {
    selectedProduct.value.optionGroups.forEach((group) => {
      const selected = selectedOptions[group.id];
      if (selected) {
        if (group.selection_type === 'single') {
          const option = group.options.find((opt) => opt.id === selected);
          if (option) {
            selectedOptionsData.groupOptions[group.id] = {
              groupName: group.name,
              selectionType: group.selection_type,
              selectedOptions: [option],
            };
          }
        } else {
          const options = selected
            .map((optionId) => group.options.find((opt) => opt.id === optionId))
            .filter(Boolean);

          if (options.length > 0) {
            selectedOptionsData.groupOptions[group.id] = {
              groupName: group.name,
              selectionType: group.selection_type,
              selectedOptions: options,
            };
          }
        }
      }
    });
  }

  addToCartWithGroupOptions(
    selectedProduct.value,
    selectedOptionsData,
    quantity.value
  );
  closeProductModal();
};

const updateCartItemQuantity = (item, newQuantity) => {
  if (newQuantity <= 0) {
    const index = cartItems.value.findIndex(
      (cartItem) => cartItem.cartId === item.cartId
    );
    if (index > -1) {
      cartItems.value.splice(index, 1);
    }
  } else {
    item.quantity = newQuantity;
  }
};

const checkout = () => {
  if (cartItems.value.length === 0) {
    alert('購物車是空的');
    return;
  }

  showCart.value = false;
  showCheckoutForm.value = true;
};

// 處理訂單提交
const handleOrderSubmitted = (orderInfo) => {
  currentOrder.value = orderInfo;
  showCheckoutForm.value = false;
  showOrderSuccess.value = true;

  // 清空購物車
  cartItems.value = [];
};

// 處理繼續點餐
const handleNewOrder = () => {
  showOrderSuccess.value = false;
  currentOrder.value = null;
};

// 關閉訂單成功頁面
const closeOrderSuccess = () => {
  showOrderSuccess.value = false;
  currentOrder.value = null;
};

// 啟用預訂模式
const enableAdvanceOrdering = () => {
  // 只有當訂餐服務開啟時才允許進入預訂模式
  if (merchantInfo.value.order_service_active) {
    isAdvanceOrderingMode.value = true;
  } else {
    alert('目前無法提供預訂服務，請稍後再試');
  }
};

// 營業時間相關計算屬性和函數
const sortedBusinessHours = computed(() => {
  if (!merchantInfo.value.business_hours) return [];
  return [...merchantInfo.value.business_hours].sort(
    (a, b) => a.day_of_week - b.day_of_week
  );
});

const upcomingSpecialHours = computed(() => {
  if (!merchantInfo.value.special_hours) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return merchantInfo.value.special_hours
    .filter((special) => {
      const specialDate = new Date(special.date);
      specialDate.setHours(0, 0, 0, 0);
      return specialDate >= today;
    })
    .slice(0, 5); // 只顯示前5個特殊時間
});

const getDayName = (dayOfWeek) => {
  const dayNames = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  return dayNames[dayOfWeek];
};

const isToday = (dayOfWeek) => {
  const today = new Date().getDay();
  return dayOfWeek === today;
};

const formatTime = (timeStr) => {
  if (!timeStr) return '';
  // 將 HH:MM:SS 格式轉為 HH:MM
  const parts = timeStr.split(':');
  return `${parts[0]}:${parts[1]}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

// 頁面載入時執行
onMounted(() => {
  loadData();
  showStoreInfo.value = true; //打開店家資訊
});

// SEO
useHead({
  title: computed(() =>
    merchantInfo.value.store_name
      ? `thankQ線上點餐 -${merchantInfo.value.store_name} `
      : 'thankQ線上點餐'
  ),
  meta: [
    {
      name: 'description',
      content: computed(
        () => merchantInfo.value.store_description || 'thankQ線上點餐服務'
      ),
    },
  ],
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
