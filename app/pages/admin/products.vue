<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="goBack"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                class="w-5 h-5 text-gray-600"
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
            <h1 class="text-xl font-semibold text-gray-900">商品管理</h1>
          </div>
          <div class="flex items-center justify-end">
            <!-- 新增商品按鈕 -->
            <button
              v-if="products.length > 0"
              @click="openAddModal"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>新增商品</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 py-6">
      <!-- 載入狀態 -->
      <div v-if="isLoading" class="text-center py-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">載入中...</p>
      </div>

      <!-- 商品列表 -->
      <div v-else-if="products.length > 0" class="space-y-4">
        <!-- 分類頁籤 -->
        <div class="bg-white mb-6">
          <div class="flex items-center justify-between mb-2">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="category in categories"
                :key="category"
                @click="handleCategoryClick(category)"
                @dblclick="
                  canSortCategory(category) && sortCategoryToTop(category)
                "
                @touchend="handleCategoryTouchEnd(category, $event)"
                :class="{
                  'bg-blue-600 text-white': activeCategory === category,
                  'bg-gray-100 text-gray-700 hover:bg-gray-200':
                    activeCategory !== category,
                }"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                :title="getCategoryTooltip(category)"
              >
                {{ category }}
                <span v-if="category === '全部'" class="ml-1 text-xs opacity-75"
                  >({{ products.length }})</span
                >
                <span v-else class="ml-1 text-xs opacity-75"
                  >({{ getProductsByCategory(category).length }})</span
                >
              </button>
            </div>
          </div>
        </div>
        <div
          v-for="(product, index) in filteredProducts"
          :key="product.id"
          :draggable="isDragActive"
          @dragstart="dragStart(index, $event)"
          @dragover.prevent="dragOver(index, $event)"
          @dragenter.prevent
          @drop="dragDrop(index, $event)"
          @touchstart="handleTouchStart(index, $event)"
          @touchmove="handleTouchMove($event)"
          @touchend="handleTouchEnd($event)"
          @touchcancel="handleTouchCancel"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all duration-200 relative select-none touch-manipulation"
          :class="{
            'opacity-30': draggedIndex === index,
            'border-blue-300 bg-blue-50 transform translate-y-2':
              dragOverIndex === index &&
              draggedIndex !== null &&
              draggedIndex !== index,
            'hover:shadow-md': draggedIndex === null,
            'z-50': draggedIndex === index,
            'bg-green-50 border-green-300':
              longPressTimer && touchStartIndex === index,
            'bg-blue-50 border-blue-300':
              isDragActive && draggedIndex === index,
          }"
        >
          <div
            v-if="product.sale_price && Number(product.sale_price) > 0"
            class="absolute -top-3 -right-3 z-20 transform rotate-12"
          ></div>
          <div class="flex items-center space-x-4">
            <!-- 商品圖片 -->
            <div
              class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
              @click="handleEditProduct(product)"
            >
              <img
                v-if="product.image_url"
                :src="product.image_url"
                :alt="product.name"
                class="w-full h-full object-cover rounded-lg"
              />
              <svg
                v-else
                class="w-6 h-6 text-gray-400"
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

            <!-- 商品資訊 -->
            <div
              class="flex-1 min-w-0 cursor-pointer"
              @click="handleEditProduct(product)"
            >
              <h3 class="text-lg font-semibold text-gray-900 mb-1 break-words">
                {{ product.name }}
              </h3>
              <p
                v-if="product.description"
                class="text-sm text-gray-600 truncate mb-2"
              >
                {{ product.description }}
              </p>
              <div class="flex items-center space-x-2">
                <!-- 如果有特價，顯示特價和原價槓掉 -->
                <template
                  v-if="product.sale_price && Number(product.sale_price) > 0"
                >
                  <div class="text-xl font-bold text-red-600">
                    ${{ Number(product.sale_price).toFixed(2) }}
                  </div>
                  <div class="text-sm text-gray-500 line-through">
                    原價 ${{ Number(product.price).toFixed(2) }}
                  </div>
                </template>
                <!-- 沒有特價，顯示原價 -->
                <template v-else>
                  <div class="text-xl font-bold text-blue-600">
                    ${{ Number(product.price).toFixed(2) }}
                  </div>
                </template>
              </div>
            </div>

            <!-- 庫存狀態切換與刪除按鈕 -->
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-600 min-w-[60px]">
                {{ product.is_active ? '有庫存' : '缺貨' }}
              </span>
              <label
                class="relative inline-flex items-center cursor-pointer toggle-switch"
              >
                <input
                  :checked="product.is_active"
                  @change="toggleProductStatus(product)"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"
                ></div>
              </label>
              <!-- 刪除按鈕 -->
              <button
                @click="deleteProduct(product)"
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="刪除商品"
              >
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-else class="text-center py-12">
        <div
          class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">還沒有商品</h3>
        <p class="text-gray-500 mb-6">開始新增您的第一個商品</p>
        <button
          @click="openAddModal"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          新增商品
        </button>
      </div>
    </div>

    <!-- 新增/編輯商品 Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ editingProduct ? '編輯商品' : '新增商品' }}
            </h2>
            <button
              @click="closeModal"
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
        </div>

        <form @submit.prevent="saveProduct" class="p-6 space-y-6">
          <!-- 商品名稱 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >商品名稱 *</label
            >
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="請輸入商品名稱"
            />
          </div>

          <!-- 商品描述 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >商品描述</label
            >
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="請輸入商品描述"
            ></textarea>
          </div>

          <!-- 價格和分類 -->
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >價格 *</label
              >
              <input
                v-model="form.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>

            <!-- 特價輸入欄位 -->
            <div
              v-if="form.has_sale_price"
              class="transition-all duration-300 col-span-1"
            >
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >金額 *</label
              >
              <input
                v-model="form.sale_price"
                type="number"
                step="0.01"
                min="0"
                :required="form.has_sale_price"
                class="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="0.00"
              />
              <p class="text-xs text-red-600 mt-1">
                請輸入特價金額，必須小於原價
              </p>
            </div>
            <!-- 特價設定 -->
            <div class="flex items-center space-x-3 mb-3 col-span-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="form.has_sale_price"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"
                ></div>
              </label>
              <span class="text-sm font-medium text-gray-700">特價</span>
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >分類</label
              >
              <input
                v-model="form.category"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例：主餐、飲料"
              />
            </div>
          </div>

          <!-- 圖片網址 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >圖片網址</label
            >
            <input
              v-model="form.image_url"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <!-- 選項群組 -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-medium text-gray-700"
                >選項群組</label
              >
              <button
                type="button"
                @click="addOptionGroup"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>新增群組</span>
              </button>
            </div>

            <div v-if="form.optionGroups.length > 0" class="space-y-6">
              <div
                v-for="(group, groupIndex) in form.optionGroups"
                :key="groupIndex"
                class="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <!-- 群組設定 -->
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-sm font-medium text-gray-900">
                    群組 {{ groupIndex + 1 }}
                  </h4>
                  <button
                    type="button"
                    @click="removeOptionGroup(groupIndex)"
                    class="text-red-600 hover:text-red-700 p-1"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <!-- 群組名稱 -->
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1"
                      >群組名稱</label
                    >
                    <input
                      v-model="group.name"
                      type="text"
                      placeholder="例：熟度、醬料"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <!-- 選擇類型 -->
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1"
                      >選擇類型</label
                    >
                    <select
                      v-model="group.selection_type"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="single">單選</option>
                      <option value="multiple">複選</option>
                    </select>
                  </div>

                  <!-- 是否必填 -->
                  <div class="flex items-center space-x-2">
                    <label class="flex items-center cursor-pointer">
                      <input
                        v-model="group.is_required"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-sm text-gray-700">必填</span>
                    </label>
                  </div>
                </div>

                <!-- 群組選項 -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label class="block text-xs font-medium text-gray-700"
                      >群組選項</label
                    >
                    <button
                      type="button"
                      @click="addOptionToGroup(groupIndex)"
                      class="text-green-600 hover:text-green-700 text-xs font-medium flex items-center space-x-1"
                    >
                      <svg
                        class="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span>新增選項</span>
                    </button>
                  </div>

                  <div v-if="group.options.length > 0" class="space-y-2">
                    <div
                      v-for="(option, optionIndex) in group.options"
                      :key="optionIndex"
                      class="flex items-center space-x-2 p-2 rounded border"
                      :class="{
                        'bg-white border-gray-200': option.is_active !== false,
                        'bg-gray-50 border-gray-300 opacity-60':
                          option.is_active === false,
                      }"
                    >
                      <!-- 狀態指示 -->
                      <!-- <span 
                        class="text-xs px-2 py-1 rounded min-w-[50px] text-center"
                        :class="{
                          'bg-green-100 text-green-700': option.is_active !== false,
                          'bg-gray-100 text-gray-500': option.is_active === false
                        }"
                      >
                        {{ option.is_active !== false ? '供應中' : '已售完' }}
                      </span> -->

                      <!-- 啟用/停用開關 -->
                      <div class="flex items-center">
                        <label
                          class="relative inline-flex items-center cursor-pointer"
                        >
                          <input
                            v-model="option.is_active"
                            type="checkbox"
                            :true-value="true"
                            :false-value="false"
                            class="sr-only peer"
                          />
                          <div
                            class="w-7 h-4 bg-orange-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-500"
                          ></div>
                        </label>
                      </div>

                      <input
                        v-model="option.name"
                        type="text"
                        placeholder="選項名稱"
                        class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        :class="{
                          'bg-gray-100 text-gray-500':
                            option.is_active === false,
                        }"
                        :disabled="option.is_active === false"
                      />

                      <div class="flex items-center space-x-1">
                        <span class="text-xs text-gray-500">$</span>
                        <input
                          v-model.number="option.price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0"
                          class="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-right focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          :class="{
                            'bg-gray-100 text-gray-500':
                              option.is_active === false,
                          }"
                          :disabled="option.is_active === false"
                        />
                      </div>

                      <!-- 刪除按鈕 -->
                      <button
                        type="button"
                        @click="removeOptionFromGroup(groupIndex, optionIndex)"
                        class="text-red-600 hover:text-red-700 p-1"
                        title="刪除選項"
                      >
                        <svg
                          class="w-3 h-3"
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
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 狀態 -->
          <div class="flex items-center space-x-3">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="form.is_active"
                type="checkbox"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
              ></div>
            </label>
            <span class="text-sm text-gray-700">立即上架</span>
          </div>

          <!-- 按鈕 -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {{ isSaving ? '儲存中...' : '儲存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const isLoading = ref(true);
const isSaving = ref(false);
const products = ref([]);
const showModal = ref(false);
const editingProduct = ref(null);
const categories = ref([]);
const activeCategory = ref('全部');

// 移動端雙擊檢測
const lastTapTime = ref(0);
const lastTapCategory = ref('');
const merchantInfo = ref('');

// 拖拉排序相關
const draggedIndex = ref(null);
const draggedItem = ref(null);
const dragOverIndex = ref(null);

// 觸控相關
const touchStartY = ref(0);
const touchStartIndex = ref(null);
const touchCurrentIndex = ref(null);
const ghostElement = ref(null);
const longPressTimer = ref(null);
const isDragActive = ref(false);
const longPressDuration = 200; // 長壓時間 200ms

// 計算屬性 - 過濾後的商品
const filteredProducts = computed(() => {
  if (activeCategory.value === '全部') {
    return products.value;
  } else if (activeCategory.value === '未分類') {
    return products.value.filter(
      (product) => !product.category || product.category.trim() === ''
    );
  }
  return products.value.filter(
    (product) => product.category === activeCategory.value
  );
});

// 取得指定分類的商品
const getProductsByCategory = (category) => {
  if (category === '全部') {
    return products.value;
  } else if (category === '未分類') {
    return products.value.filter(
      (product) => !product.category || product.category.trim() === ''
    );
  }
  return products.value.filter((product) => product.category === category);
};

const form = ref({
  name: '',
  description: '',
  price: '',
  sale_price: '',
  has_sale_price: false, // 是否設定特價
  category: '',
  image_url: '',
  is_active: true,
  optionGroups: [], // 選項群組
});

// 載入商品列表
const loadProducts = async () => {
  try {
    isLoading.value = true;
    const response = await $fetch('/api/merchant/products', {
      credentials: 'include',
      // 防止快取問題
      headers: {
        'Cache-Control': 'no-cache',
      },
      query: {
        t: Date.now(), // 添加時間戳防止快取
      },
    });

    // 處理不同的回應格式
    let productList = [];
    if (response.data && Array.isArray(response.data)) {
      productList = response.data;
    } else if (response.products && Array.isArray(response.products)) {
      productList = response.products;
    } else if (Array.isArray(response)) {
      productList = response;
    }

    products.value = productList;

    // 取得分類列表，並按照指定順序排列
    const categorySet = new Set();
    productList.forEach((product) => {
      if (product.category && product.category.trim() !== '') {
        categorySet.add(product.category);
      }
    });

    // 檢查是否有未分類的商品
    const hasUncategorized = productList.some(
      (product) => !product.category || product.category.trim() === ''
    );

    // 建立分類陣列：一般分類 -> 未分類 -> 全部
    const orderedCategories = [...Array.from(categorySet)];
    if (hasUncategorized) {
      orderedCategories.push('未分類');
    }
    orderedCategories.push('全部');

    categories.value = orderedCategories;
  } catch (error) {
    console.error('Failed to load products:', error);
    console.error('Error details:', {
      status: error.status,
      statusCode: error.statusCode,
      statusMessage: error.statusMessage,
      data: error.data,
    });
    products.value = [];
    alert('載入商品列表失敗: ' + (error.statusMessage || error.message));
  } finally {
    isLoading.value = false;
  }
};

// 返回上一頁
const goBack = () => {
  navigateTo('/admin/dashboard');
};

// 開啟新增商品 Modal
const openAddModal = () => {
  editingProduct.value = null;
  resetForm();
  showModal.value = true;
};

// 處理編輯商品點擊
const handleEditProduct = (product) => {
  // 只有在真正的拖拉模式下才阻止編輯
  if (isDragActive.value) {
    return;
  }
  editProduct(product);
};

// 編輯商品
const editProduct = (product) => {
  // 只使用 optionGroups，不要使用 options（options 是個別選項，不是群組）
  const sourceGroups = product.optionGroups || [];

  if (sourceGroups && sourceGroups.length > 0) {
    sourceGroups.forEach((group, index) => {
      // 群組資料處理
    });
  }

  editingProduct.value = product;
  form.value = {
    name: product.name,
    description: product.description || '',
    price: product.price,
    sale_price: product.sale_price || '',
    has_sale_price: !!(product.sale_price && Number(product.sale_price) > 0), // 檢查是否有特價
    category: product.category || '',
    image_url: product.image_url || '',
    is_active: product.is_active,
    optionGroups:
      sourceGroups && Array.isArray(sourceGroups)
        ? sourceGroups.map((group) => {
            return {
              name: group.name || '',
              selection_type: group.selection_type || 'single',
              is_required: Boolean(group.is_required),
              options:
                group.options && Array.isArray(group.options)
                  ? group.options.map((opt) => {
                      return {
                        name: opt.name || '',
                        price: Number(opt.price) || 0,
                        is_active:
                          opt.is_active !== undefined ? opt.is_active : true,
                      };
                    })
                  : [],
            };
          })
        : [],
  };

  if (form.value.optionGroups.length > 0) {
    form.value.optionGroups.forEach((group, index) => {
      // 表單群組處理
    });
  }

  showModal.value = true;
};

// 關閉 Modal
const closeModal = () => {
  showModal.value = false;
  editingProduct.value = null;
  resetForm();
};

// 重置表單
const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    price: '',
    sale_price: '',
    has_sale_price: false,
    category: '',
    image_url: '',
    is_active: true,
    optionGroups: [],
  };
};

// 選項群組管理
const addOptionGroup = () => {
  form.value.optionGroups.push({
    name: '',
    selection_type: 'single',
    is_required: false,
    options: [],
  });
};

const removeOptionGroup = (index) => {
  form.value.optionGroups.splice(index, 1);
};

const addOptionToGroup = (groupIndex) => {
  form.value.optionGroups[groupIndex].options.push({
    name: '',
    price: 0,
    is_active: true,
  });
};

const removeOptionFromGroup = (groupIndex, optionIndex) => {
  form.value.optionGroups[groupIndex].options.splice(optionIndex, 1);
};

// 儲存商品
const saveProduct = async () => {
  try {
    isSaving.value = true;

    const productData = {
      ...form.value,
      price: parseFloat(form.value.price),
      sale_price:
        form.value.has_sale_price && form.value.sale_price
          ? parseFloat(form.value.sale_price)
          : null,
      // 移除前端專用的欄位
      has_sale_price: undefined,
    };

    let response;
    if (editingProduct.value) {
      response = await $fetch(
        `/api/merchant/products/${editingProduct.value.id}`,
        {
          method: 'PUT',
          body: productData,
        }
      );
    } else {
      response = await $fetch('/api/merchant/products', {
        method: 'POST',
        body: productData,
      });
    }

    closeModal();

    // 強制重新載入商品列表
    await loadProducts();

    alert(editingProduct.value ? '商品更新成功' : '商品新增成功');
  } catch (error) {
    console.error('Failed to save product:', error);
    alert('儲存商品失敗: ' + (error.data?.message || error.message));
  } finally {
    isSaving.value = false;
  }
};

// 切換商品庫存狀態
const toggleProductStatus = async (product) => {
  try {
    await $fetch(`/api/merchant/products/${product.id}`, {
      method: 'PUT',
      body: {
        ...product,
        is_active: !product.is_active,
      },
    });

    product.is_active = !product.is_active;
  } catch (error) {
    console.error('Failed to toggle product status:', error);
    alert('更新商品庫存狀態失敗');
    // 復原狀態
    product.is_active = !product.is_active;
  }
};

// 刪除商品
const deleteProduct = async (product) => {
  if (!confirm(`確定要刪除商品「${product.name}」嗎？`)) {
    return;
  }

  try {
    await $fetch(`/api/merchant/products/${product.id}`, {
      method: 'DELETE',
    });

    await loadProducts();
    alert('商品刪除成功');
  } catch (error) {
    console.error('Failed to delete product:', error);
    alert('刪除商品失敗');
  }
};

// 拖拉排序功能
const dragStart = (index, event) => {
  draggedIndex.value = index;
  draggedItem.value = filteredProducts.value[index];
  event.dataTransfer.effectAllowed = 'move';
};

const dragOver = (index, event) => {
  event.preventDefault();
  if (draggedIndex.value !== null && draggedIndex.value !== index) {
    dragOverIndex.value = index;
  }
};

const dragDrop = async (dropIndex, event) => {
  event.preventDefault();

  if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
    draggedIndex.value = null;
    draggedItem.value = null;
    return;
  }

  const draggedProduct = draggedItem.value;
  const targetProduct = filteredProducts.value[dropIndex];

  try {
    // 更新本地排序
    const updatedProducts = [...filteredProducts.value];
    updatedProducts.splice(draggedIndex.value, 1);
    updatedProducts.splice(dropIndex, 0, draggedProduct);

    // 計算新的 sort_order
    const updates = updatedProducts.map((product, index) => ({
      id: product.id,
      sort_order: index,
    }));

    // 發送排序更新到後端
    await $fetch('/api/merchant/products/reorder', {
      method: 'POST',
      body: {updates},
    });

    // 重新載入商品列表
    await loadProducts();
  } catch (error) {
    console.error('Failed to reorder products:', error);
    alert('更新商品排序失敗');
  } finally {
    draggedIndex.value = null;
    draggedItem.value = null;
    dragOverIndex.value = null;
  }
};

// 長壓觸控事件處理
const handleTouchStart = (index, event) => {
  // 如果點擊的是按鈕或其他交互元素，不處理長壓
  const target = event.target;
  if (
    target.closest('button') ||
    target.closest('input') ||
    target.closest('.toggle-switch')
  ) {
    return;
  }

  // 不要阻止預設行為，讓正常點擊事件能夠觸發
  touchStartIndex.value = index;

  const touch = event.touches[0];
  touchStartY.value = touch.clientY;

  // 開始長壓計時器
  longPressTimer.value = setTimeout(() => {
    // 長壓觸發拖拉模式
    isDragActive.value = true;
    draggedIndex.value = index;
    draggedItem.value = filteredProducts.value[index];

    // 禁用頁面滾動
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    // 震動反饋（如果支持）
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // 創建殘影元素
    createGhostElement(index, touch.clientX, touch.clientY);
  }, longPressDuration);
};

const handleTouchMove = (event) => {
  const touch = event.touches[0];
  const currentY = touch.clientY;
  const deltaY = Math.abs(currentY - touchStartY.value);

  // 如果移動距離超過閾值，取消長壓
  if (deltaY > 10 && longPressTimer.value) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
    return;
  }

  // 只有在拖拉模式激活後才處理移動
  if (!isDragActive.value || touchStartIndex.value === null) return;

  // 阻止頁面滑動
  event.preventDefault();
  event.stopPropagation();

  // 更新殘影位置
  updateGhostPosition(touch.clientX, touch.clientY);

  // 計算當前觸摸位置對應的目標索引
  const itemHeight = 120;
  const moveDistance = Math.round((currentY - touchStartY.value) / itemHeight);
  const newIndex = Math.max(
    0,
    Math.min(
      filteredProducts.value.length - 1,
      touchStartIndex.value + moveDistance
    )
  );

  if (newIndex !== touchCurrentIndex.value) {
    touchCurrentIndex.value = newIndex;
    dragOverIndex.value = newIndex;
  }
};

const handleTouchEnd = async (event) => {
  // 清除長壓計時器
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }

  removeGhostElement();

  // 只有在拖拉模式激活後才執行排序
  if (isDragActive.value && touchStartIndex.value !== null) {
    const startIndex = touchStartIndex.value;
    const endIndex = touchCurrentIndex.value;

    if (startIndex !== null && endIndex !== null && startIndex !== endIndex) {
      await reorderProducts(startIndex, endIndex);
    }
  }

  // 延遲重置狀態，避免與點擊事件衝突
  setTimeout(() => {
    resetDragState();
  }, 50);
};

const handleTouchCancel = () => {
  // 清除長壓計時器
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }

  removeGhostElement();
  resetDragState();
};

// 殘影動畫相關函數
const createGhostElement = (index, x, y) => {
  const product = filteredProducts.value[index];

  const ghost = document.createElement('div');
  ghost.className =
    'fixed pointer-events-none z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-4 opacity-80 transform rotate-3 scale-105';
  ghost.style.left = x - 50 + 'px';
  ghost.style.top = y - 60 + 'px';
  ghost.style.width = '300px';

  ghost.innerHTML = `
    <div class="flex items-center space-x-4">
      <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        ${
          product.image_url
            ? `<img src="${product.image_url}" alt="${product.name}" class="w-full h-full object-cover rounded-lg" />`
            : `<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
               </svg>`
        }
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-semibold text-gray-900 truncate">${
          product.name
        }</h3>
        <div class="text-sm font-bold text-blue-600">${Number(
          product.price
        ).toFixed(2)}</div>
      </div>
    </div>
  `;

  document.body.appendChild(ghost);
  ghostElement.value = ghost;
};

const updateGhostPosition = (x, y) => {
  if (ghostElement.value) {
    ghostElement.value.style.left = x - 50 + 'px';
    ghostElement.value.style.top = y - 60 + 'px';
  }
};

const removeGhostElement = () => {
  if (ghostElement.value) {
    document.body.removeChild(ghostElement.value);
    ghostElement.value = null;
  }
};

const resetDragState = () => {
  touchStartIndex.value = null;
  touchCurrentIndex.value = null;
  draggedIndex.value = null;
  draggedItem.value = null;
  dragOverIndex.value = null;
  isDragActive.value = false;

  // 恢復頁面滾動
  document.body.style.overflow = '';
  document.body.style.touchAction = '';

  // 清除計時器
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
};

// 重新排序的共用函數
const reorderProducts = async (fromIndex, toIndex) => {
  const draggedProduct = filteredProducts.value[fromIndex];

  try {
    // 更新本地排序
    const updatedProducts = [...filteredProducts.value];
    updatedProducts.splice(fromIndex, 1);
    updatedProducts.splice(toIndex, 0, draggedProduct);

    // 計算新的 sort_order
    const updates = updatedProducts.map((product, index) => ({
      id: product.id,
      sort_order: index,
    }));

    // 發送排序更新到後端
    await $fetch('/api/merchant/products/reorder', {
      method: 'POST',
      body: {updates},
    });

    // 重新載入商品列表
    await loadProducts();
  } catch (error) {
    console.error('Failed to reorder products:', error);
    alert('更新商品排序失敗');
  }
};

// 檢查分類是否可以排序
const canSortCategory = (category) => {
  return category !== '全部' && category !== '未分類';
};

// 取得分類提示文字
const getCategoryTooltip = (category) => {
  if (category === '全部') {
    return '顯示所有商品';
  } else if (category === '未分類') {
    return '顯示未分類商品';
  } else {
    return `雙擊將「${category}」分類置頂排序`;
  }
};

// 處理分類點擊（桌面端）
const handleCategoryClick = (category) => {
  activeCategory.value = category;
};

// 處理移動端雙擊檢測
const handleCategoryTouchEnd = (category, event) => {
  event.preventDefault(); // 防止觸發 click 事件

  const currentTime = Date.now();
  const timeDiff = currentTime - lastTapTime.value;

  // 檢查是否為雙擊（300ms 內，且是同一個分類）
  if (timeDiff < 300 && lastTapCategory.value === category) {
    // 雙擊邏輯
    if (canSortCategory(category)) {
      sortCategoryToTop(category);
    }
    // 重置計時器
    lastTapTime.value = 0;
    lastTapCategory.value = '';
  } else {
    // 單擊邏輯
    activeCategory.value = category;
    lastTapTime.value = currentTime;
    lastTapCategory.value = category;
  }
};

// 分類置頂排序
const sortCategoryToTop = async (category) => {
  if (!canSortCategory(category)) {
    return;
  }

  try {
    // 獲取該分類的所有商品
    const categoryProducts = products.value.filter(
      (product) => (product.category || '未分類') === category
    );

    if (categoryProducts.length === 0) {
      alert(`「${category}」分類中沒有商品`);
      return;
    }

    // 獲取其他分類的商品
    const otherProducts = products.value.filter(
      (product) => (product.category || '未分類') !== category
    );

    // 重新排序：該分類商品放在最前面
    const reorderedProducts = [...categoryProducts, ...otherProducts];

    // 計算新的 sort_order
    const updates = reorderedProducts.map((product, index) => ({
      id: product.id,
      sort_order: index,
    }));

    // 發送排序更新到後端
    await $fetch('/api/merchant/products/reorder', {
      method: 'POST',
      body: {updates},
    });

    // 重新載入商品列表
    await loadProducts();

    // 切換到該分類
    activeCategory.value = category;

    alert(`「${category}」分類已置頂排序`);
  } catch (error) {
    console.error('Failed to sort category to top:', error);
    alert('分類置頂排序失敗');
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

// 監聽特價設定狀態變化
watch(
  () => form.value.has_sale_price,
  (newValue) => {
    // 如果取消勾選特價，清空特價金額
    if (!newValue) {
      form.value.sale_price = '';
    }
  }
);

// 頁面載入時取得商品列表
onMounted(() => {
  loadProducts();
  loadMerchantInfo();
});

useHead({
  title: computed(() =>
    merchantInfo.value.store_name
      ? `thankQ商品管理 -${merchantInfo.value.store_name}`
      : 'thankQ商品管理'
  ),
  meta: [
    {
      name: 'description',
      content: computed(
        () => merchantInfo.value.store_description || 'thankQ商品管理'
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
