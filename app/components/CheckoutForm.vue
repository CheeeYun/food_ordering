<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <div
      class="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
    >
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold">訂單資訊</h3>
          <button
            @click="$emit('close')"
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

        <form @submit.prevent="submitOrder" class="space-y-6">
          <!-- 訂單摘要 -->
          <div class="bg-red-100/50 border border-red-400 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3">訂單摘要</h4>
            <div class="space-y-3">
              <div
                v-for="item in cartItems"
                :key="item.cartId"
                class="border-b border-gray-200 pb-2 last:border-b-0 last:pb-0"
              >
                <div class="flex justify-between text-sm font-medium mb-1">
                  <span>{{ item.name }} × {{ item.quantity }}</span>
                  <span
                    >${{ (item.totalPrice * item.quantity).toFixed(0) }}</span
                  >
                </div>

                <!-- 顯示選項群組選擇 -->
                <div
                  v-if="
                    item.selectedGroupOptions &&
                    Object.keys(item.selectedGroupOptions).length > 0
                  "
                  class="text-xs text-gray-600 ml-2"
                >
                  <div
                    v-for="(groupData, groupId) in item.selectedGroupOptions"
                    :key="groupId"
                    class="mb-1"
                  >
                    <span class="font-medium">{{ groupData.groupName }}:</span>
                    <span class="ml-1">{{
                      groupData.selectedOptions
                        .map((opt) => opt.name)
                        .join(', ')
                    }}</span>
                    <span
                      v-if="
                        groupData.selectedOptions.some((opt) => opt.price > 0)
                      "
                      class="ml-1 text-green-600"
                    >
                      (+${{
                        groupData.selectedOptions
                          .reduce((sum, opt) => sum + Number(opt.price), 0)
                          .toFixed(0)
                      }})
                    </span>
                  </div>
                </div>

                <!-- 向後相容：顯示傳統選項 -->
                <div
                  v-else-if="item.selectedOption"
                  class="text-xs text-gray-600 ml-2"
                >
                  <span>{{ item.selectedOption.name }}</span>
                  <span
                    v-if="item.selectedOption.price > 0"
                    class="ml-1 text-green-600"
                  >
                    (+${{ Number(item.selectedOption.price).toFixed(0) }})
                  </span>
                </div>

                <!-- 如果有選項描述 -->
                <div
                  v-else-if="item.optionDescription"
                  class="text-xs text-gray-600 ml-2"
                >
                  {{ item.optionDescription }}
                </div>
              </div>

              <!-- 折扣顯示 -->
              <div
                v-if="discountAmount > 0"
                class="border-t border-gray-200 pt-2"
              >
                <div class="flex justify-between text-sm text-gray-600">
                  <span>小計</span>
                  <span>${{ cartTotal }}</span>
                </div>
                <div class="flex justify-between text-sm text-green-600">
                  <span
                    >提前訂餐優惠 (-{{
                      merchantSettings.advance_discount_rate
                    }}%)</span
                  >
                  <span>-${{ discountAmount }}</span>
                </div>
              </div>

              <!-- 外送費顯示 -->
              <div
                v-if="orderForm.diningType === 'delivery'"
                class="border-t border-gray-200 pt-2"
              >
                <div class="flex justify-between text-sm text-gray-600">
                  <span>外送費</span>
                  <span v-if="calculateDeliveryFee === 0" class="text-green-600"
                    >免費</span
                  >
                  <span v-else>${{ calculateDeliveryFee }}</span>
                </div>
                <div
                  v-if="deliveryDistance !== null"
                  class="text-xs text-gray-500 mt-1"
                >
                  距離: {{ deliveryDistance }}km
                  <span v-if="merchantSettings.delivery_free_km > 0">
                    ({{ merchantSettings.delivery_free_km }}公里內 ${{
                      merchantSettings.delivery_base_fee
                    }})
                  </span>
                </div>
                <div
                  v-else-if="merchantSettings.delivery_base_fee > 0"
                  class="text-xs text-gray-500 mt-1"
                >
                  基本外送費 ${{ merchantSettings.delivery_base_fee }}
                  <span v-if="merchantSettings.delivery_free_km > 0">
                    ({{ merchantSettings.delivery_free_km }}公里內)
                  </span>
                </div>
              </div>

              <div
                class="border-t border-gray-200 pt-2 flex justify-between font-medium"
              >
                <span>總計</span>
                <span class="text-blue-600">${{ finalTotal }}</span>
              </div>
            </div>
          </div>

          <!-- 取餐時間 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3"
              >取餐時間</label
            >
            <div class="space-y-2">
              <label
                class="flex items-center"
                :class="{
                  'opacity-50 cursor-not-allowed': isAdvanceOrderingMode,
                }"
              >
                <input
                  v-model="orderForm.pickupType"
                  type="radio"
                  value="immediate"
                  :disabled="isAdvanceOrderingMode"
                  class="mr-3"
                />
                <span>立即取餐(約30分鐘)</span>
                <span
                  v-if="isAdvanceOrderingMode"
                  class="ml-2 text-xs text-gray-500"
                  >(僅限預約取餐)</span
                >
              </label>
              <label class="flex items-center">
                <input
                  v-model="orderForm.pickupType"
                  type="radio"
                  value="scheduled"
                  class="mr-3"
                />
                <span>預約取餐</span>
              </label>
            </div>

            <!-- 預約時間選擇 -->
            <div
              v-if="orderForm.pickupType === 'scheduled'"
              class="mt-3 space-y-3"
            >
              <div>
                <label class="block text-xs text-gray-600 mb-1">取餐日期</label>
                <input
                  v-model="orderForm.pickupDate"
                  type="date"
                  :min="minDate"
                  :max="maxDate"
                  required
                  :class="{
                    'border-red-500 focus:ring-red-500 focus:border-red-500':
                      dateError,
                    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500':
                      !dateError,
                  }"
                />
                <div v-if="dateError" class="mt-1 text-xs text-red-600">
                  {{ dateError }}
                </div>
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">取餐時間</label>
                <select
                  v-model="orderForm.pickupTime"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">請選擇時間</option>
                  <option
                    v-for="time in availableTimes"
                    :key="time"
                    :value="time"
                  >
                    {{ time }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- 聯絡資訊 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >聯絡電話 *</label
            >
            <input
              v-model="orderForm.phone"
              type="tel"
              required
              pattern="[0-9]{10}"
              placeholder="請輸入10位數手機號碼（例：0912345678）"
              maxlength="10"
              :class="{
                'border-red-500 focus:ring-red-500 focus:border-red-500':
                  phoneError,
                'border-green-500 focus:ring-green-500 focus:border-green-500':
                  orderForm.phone && !phoneError,
                'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500':
                  !phoneError && !orderForm.phone,
              }"
              @input="validatePhone"
            />
            <div v-if="phoneError" class="mt-1 text-xs text-red-600">
              {{ phoneError }}
            </div>
            <div
              v-else-if="orderForm.phone && orderForm.phone.length === 10"
              class="mt-1 text-xs text-green-600"
            >
              ✓ 電話號碼格式正確
            </div>
          </div>

          <!-- 訂購人姓名 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >訂購人姓名</label
            >
            <input
              v-model="orderForm.customerName"
              type="text"
              placeholder="請輸入訂購人姓名（選填）"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- 用餐方式 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3"
              >用餐方式</label
            >
            <div
              class="grid gap-3"
              :class="`grid-cols-${availableDiningTypes.length}`"
            >
              <label
                v-for="diningType in availableDiningTypes"
                :key="diningType.value"
                class="flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                :class="{
                  'border-blue-500 bg-blue-50':
                    orderForm.diningType === diningType.value,
                  'opacity-50 cursor-not-allowed':
                    diningType.value === 'delivery' && !isDeliveryAvailable,
                  'border-red-200 bg-red-50':
                    diningType.value === 'delivery' && !isDeliveryAvailable,
                }"
              >
                <input
                  v-model="orderForm.diningType"
                  type="radio"
                  :value="diningType.value"
                  :disabled="
                    diningType.value === 'delivery' && !isDeliveryAvailable
                  "
                  class="sr-only"
                />
                <div class="text-center">
                  <svg
                    class="w-6 h-6 mx-auto mb-1 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      :d="diningType.icon"
                    />
                  </svg>
                  <span class="text-sm">{{
                    diningType.label
                      .replace('🥡 ', '')
                      .replace('🍽️ ', '')
                      .replace('🚚 ', '')
                  }}</span>
                </div>
              </label>
            </div>

            <!-- 外送服務提示 -->
            <div
              v-if="
                merchantSettings.available_dining_types.includes('delivery')
              "
              class="mt-2 text-xs"
            >
              <!-- 免費外送條件 -->
              <div
                v-if="merchantSettings.delivery_minimum_amount > 0"
                class="text-red-400 bg-gray-50 p-2 rounded mb-2"
              >
                *訂單滿 ${{ merchantSettings.delivery_minimum_amount }} 享({{
                  merchantSettings.max_delivery_distance
                }}公里內)免費外送
                <span
                  v-if="
                    props.cartTotal >= merchantSettings.delivery_minimum_amount
                  "
                >
                  ✓ 已達免費外送門檻
                </span>
                <span v-else>
                  (還差 ${{
                    merchantSettings.delivery_minimum_amount - props.cartTotal
                  }})
                </span>
              </div>

              <!-- 外送費說明 -->
              <div
                v-if="
                  merchantSettings.delivery_base_fee > 0 &&
                  orderForm.diningType === 'delivery'
                "
                class="text-gray-600 bg-gray-50 p-2 rounded mb-2"
              >
                基本外送費 ${{ merchantSettings.delivery_base_fee }}
                <span v-if="merchantSettings.delivery_free_km > 0">
                  ({{ merchantSettings.delivery_free_km }}公里內)
                </span>
                <span v-if="merchantSettings.delivery_per_km_fee > 0">
                  ，超出每公里加收 ${{ merchantSettings.delivery_per_km_fee }}
                </span>
              </div>

              <!-- 距離相關提示 -->
              <div
                v-if="
                  merchantSettings.max_delivery_distance > 0 &&
                  orderForm.diningType === 'delivery'
                "
              >
                <div
                  v-if="deliveryDistance === null"
                  class="text-blue-600 bg-blue-50 p-2 rounded"
                >
                  請先計算外送距離以確認是否在服務範圍內
                </div>
                <div
                  v-else-if="
                    deliveryDistance > merchantSettings.max_delivery_distance
                  "
                  class="text-red-600 bg-red-50 p-2 rounded"
                >
                  外送距離 {{ deliveryDistance }} 公里超過最大外送範圍
                  {{ merchantSettings.max_delivery_distance }} 公里
                </div>
              </div>
            </div>

            <!-- 內用桌號 -->
            <div v-if="orderForm.diningType === 'dine-in'" class="mt-3">
              <label class="block text-xs text-gray-600 mb-1"
                >桌號（選填）</label
              >
              <input
                v-model="orderForm.tableNumber"
                type="text"
                placeholder="請輸入桌號，例：A1、12"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- 外送地址 -->
            <div v-if="orderForm.diningType === 'delivery'" class="mt-3">
              <label class="block text-xs text-gray-600 mb-1">外送地址 *</label>
              <div class="space-y-2">
                <div class="flex space-x-2">
                  <textarea
                    v-model="orderForm.deliveryAddress"
                    rows="2"
                    required
                    placeholder="請輸入詳細地址（例：台北市大安區信義路四段123號）"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{
                      'border-red-500': distanceError,
                      'border-green-500 bg-green-50':
                        deliveryDistance !== null && !distanceError,
                    }"
                    :disabled="deliveryDistance !== null && !distanceError"
                    @input="resetDistanceCalculation"
                  ></textarea>
                  <button
                    v-if="!(deliveryDistance !== null && !distanceError)"
                    type="button"
                    @click="calculateDistance"
                    :disabled="
                      !orderForm.deliveryAddress || isCalculatingDistance
                    "
                    class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="isCalculatingDistance">計算中...</span>
                    <span v-else>計算距離</span>
                  </button>
                  <div
                    v-else
                    class="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm flex items-center"
                  >
                    <svg
                      class="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    已確認
                  </div>
                </div>

                <!-- 距離顯示 -->
                <div v-if="deliveryDistance !== null" class="text-sm">
                  <div class="flex items-center space-x-2">
                    <span class="text-green-600"
                      >✓ 外送距離：{{ deliveryDistance }} 公里</span
                    >
                    <span
                      v-if="merchantSettings.max_delivery_distance > 0"
                      :class="{
                        'text-green-600':
                          deliveryDistance <=
                          merchantSettings.max_delivery_distance,
                        'text-red-600':
                          deliveryDistance >
                          merchantSettings.max_delivery_distance,
                      }"
                    >
                      (最大外送距離：{{
                        merchantSettings.max_delivery_distance
                      }}
                      公里)
                    </span>
                  </div>
                </div>

                <!-- 錯誤訊息 -->
                <div v-if="distanceError" class="text-sm text-red-600">
                  {{ distanceError }}
                </div>

                <!-- 地址格式提示 -->
                <div class="text-xs text-gray-500">
                  請輸入完整地址，包含縣市、區域、路名門牌號碼
                </div>
              </div>
            </div>
          </div>

          <!-- 支付方式 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3"
              >支付方式</label
            >
            <div class="space-y-3">
              <label
                v-for="paymentMethod in availablePaymentMethods"
                :key="paymentMethod.value"
                class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                :class="{
                  'border-blue-500 bg-blue-50':
                    orderForm.paymentMethod === paymentMethod.value,
                }"
              >
                <input
                  v-model="orderForm.paymentMethod"
                  type="radio"
                  :value="paymentMethod.value"
                  class="mr-3"
                />
                <div class="flex items-center">
                  <svg
                    class="w-5 h-5 mr-2"
                    :class="
                      paymentMethod.value === 'cash'
                        ? 'text-green-600'
                        : paymentMethod.value === 'bank_transfer'
                        ? 'text-blue-600'
                        : 'text-purple-600'
                    "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      :d="paymentMethod.icon"
                    />
                  </svg>
                  <span>{{
                    paymentMethod.label
                      .replace('💵 ', '')
                      .replace('🏦 ', '')
                      .replace('📱 ', '')
                  }}</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 特殊需求 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >特殊需求</label
            >
            <textarea
              v-model="orderForm.notes"
              rows="3"
              placeholder="請輸入特殊需求或備註（選填）"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <!-- 提交按鈕 -->
          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || !canSubmitOrder"
              :class="{
                'bg-green-500 hover:bg-green-600':
                  orderForm.paymentMethod !== 'mobile',
                'bg-green-600 hover:bg-green-700':
                  orderForm.paymentMethod === 'mobile',
              }"
              class="flex-1 px-4 py-3 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting">處理中...</span>
              <span v-else-if="orderForm.paymentMethod === 'mobile'"
                >點我付款</span
              >
              <span v-else>確認訂單</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  cartItems: {
    type: Array,
    required: true,
  },
  cartTotal: {
    type: Number,
    required: true,
  },
  merchantId: {
    type: String,
    required: true,
  },
  isAdvanceOrderingMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'order-submitted']);

const isSubmitting = ref(false);

// 商家設定
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
  bank_account: '',
  business_hours: [],
  special_hours: [],
});

// 外送距離相關
const deliveryDistance = ref(null);
const isCalculatingDistance = ref(false);
const distanceError = ref('');

// 日期驗證相關
const dateError = ref('');

// 電話驗證相關
const phoneError = ref('');

// 訂單表單
const orderForm = ref({
  pickupType: 'immediate',
  pickupDate: '',
  pickupTime: '',
  phone: '',
  customerName: '',
  diningType: 'takeaway',
  tableNumber: '',
  deliveryAddress: '',
  paymentMethod: 'cash',
  notes: '',
});

// 今天日期
const today = computed(() => {
  const date = new Date();
  return date.toISOString().split('T')[0];
});

// 最小可選日期（預訂模式下為明天，正常模式為今天）
const minDate = computed(() => {
  const date = new Date();
  if (props.isAdvanceOrderingMode) {
    date.setDate(date.getDate() + 1); // 明天
  }
  return date.toISOString().split('T')[0];
});

// 最大可選日期（14天後）
const maxDate = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().split('T')[0];
});

// 可選時間段
const availableTimes = computed(() => {
  const times = [];
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const isToday = orderForm.value.pickupDate === today.value;
  const selectedDate = new Date(orderForm.value.pickupDate || today.value);
  const dayOfWeek = selectedDate.getDay(); // 0=週日, 1=週一, ..., 6=週六

  // 檢查該日期是否為休假日
  const isHoliday = merchantSettings.value.special_hours.some((specialHour) => {
    const specialDate = new Date(specialHour.date);
    const compareDate = new Date(selectedDate);
    specialDate.setHours(0, 0, 0, 0);
    compareDate.setHours(0, 0, 0, 0);
    return (
      specialDate.getTime() === compareDate.getTime() && !specialHour.is_open
    );
  });

  // 如果是休假日，不提供任何時間選項（但允許選擇日期，在驗證時顯示錯誤）
  if (isHoliday) {
    return [];
  }

  // 獲取該星期幾的營業時間
  const businessHour = merchantSettings.value.business_hours.find(
    (bh) => bh.day_of_week === dayOfWeek
  );

  // 如果該天不營業，不提供時間選項
  if (!businessHour || !businessHour.is_open) {
    return [];
  }

  // 解析營業時間
  const openTime = businessHour.open_time; // HH:MM:SS 格式
  const closeTime = businessHour.close_time; // HH:MM:SS 格式

  if (!openTime || !closeTime) {
    return [];
  }

  // 處理時間格式，確保可以正確解析 HH:MM:SS 或 HH:MM 格式
  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    return {
      hour: parseInt(parts[0], 10),
      minute: parseInt(parts[1], 10),
    };
  };

  const openTimeParts = parseTime(openTime);
  const closeTimeParts = parseTime(closeTime);

  if (!openTimeParts || !closeTimeParts) {
    return [];
  }

  const {hour: openHour, minute: openMinute} = openTimeParts;
  const {hour: closeHour, minute: closeMinute} = closeTimeParts;

  // 生成營業時間內的時間選項
  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;

  // 檢查是否跨夜營業
  const isOvernight = closeTimeInMinutes <= openTimeInMinutes;

  for (let hour = 0; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      // 間隔10分鐘
      // 檢查是否在營業時間內
      const timeInMinutes = hour * 60 + minute;
      let isInBusinessHours = false;

      if (isOvernight) {
        // 跨夜營業
        if (closeTimeInMinutes === 0) {
          // 關店時間是午夜 00:00，營業到午夜（但不包含00:00）
          isInBusinessHours =
            timeInMinutes >= openTimeInMinutes && timeInMinutes < 1440; // 1440 = 24:00
        } else {
          // 跨夜但不是到午夜（例如17:30-02:00）
          isInBusinessHours =
            timeInMinutes >= openTimeInMinutes ||
            timeInMinutes <= closeTimeInMinutes;
        }
      } else {
        // 一般營業：開店時間到關店時間（同一天）
        isInBusinessHours =
          timeInMinutes >= openTimeInMinutes &&
          timeInMinutes <= closeTimeInMinutes;
      }

      if (!isInBusinessHours) {
        continue;
      }

      // 如果是當日訂餐，過濾掉當前時間之前的時間
      if (isToday) {
        if (
          hour < currentHour ||
          (hour === currentHour && minute <= currentMinute)
        ) {
          continue;
        }
      }

      const timeStr = `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
      times.push(timeStr);
    }
  }
  return times;
});

// 載入商家設定
const loadMerchantSettings = async () => {
  try {
    const {data} = await $fetch(`/api/customer/merchant/${props.merchantId}`);
    console.log('Merchant data from API:', data);

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
      bank_account: data.bank_account || '',
      business_hours: data.business_hours || [],
      special_hours: data.special_hours || [],
    };

    console.log('Merchant settings loaded:', merchantSettings.value);

    // 設定預設值為第一個可用選項
    if (merchantSettings.value.available_dining_types.length > 0) {
      orderForm.value.diningType =
        merchantSettings.value.available_dining_types[0];
    }
    if (merchantSettings.value.available_payment_methods.length > 0) {
      orderForm.value.paymentMethod =
        merchantSettings.value.available_payment_methods[0];
    }

    // 如果是預訂模式，強制設為預約取餐
    if (props.isAdvanceOrderingMode) {
      orderForm.value.pickupType = 'scheduled';
    }
  } catch (error) {
    console.error('Failed to load merchant settings:', error);
  }
};

// 可用的用餐方式
const availableDiningTypes = computed(() => {
  const types = [
    {
      value: 'takeaway',
      label: '🥡 外帶',
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    },
    {
      value: 'dine-in',
      label: '🍽️ 內用',
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
    },
    {
      value: 'delivery',
      label: '🚚 外送',
      icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
    },
  ];
  return types.filter((type) =>
    merchantSettings.value.available_dining_types.includes(type.value)
  );
});

// 可用的支付方式
const availablePaymentMethods = computed(() => {
  const methods = [
    {
      value: 'cash',
      label: '💵 現場付款',
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    },
    {
      value: 'bank_transfer',
      label: merchantSettings.value.bank_account
        ? `🏦 銀行轉帳 (${merchantSettings.value.bank_account})`
        : '🏦 銀行轉帳',
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    },
    {
      value: 'mobile',
      label: '📱 LINE Pay',
      icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    },
  ];

  let availableMethods = methods.filter((method) =>
    merchantSettings.value.available_payment_methods.includes(method.value)
  );

  // 如果是外送且開啟預先收款，移除現場付款選項
  if (
    orderForm.value.diningType === 'delivery' &&
    merchantSettings.value.delivery_prepayment === 1
  ) {
    availableMethods = availableMethods.filter(
      (method) => method.value !== 'cash'
    );
  }

  return availableMethods;
});

// 計算外送費
const calculateDeliveryFee = computed(() => {
  if (orderForm.value.diningType !== 'delivery') {
    return 0;
  }

  // 檢查是否達到免費外送金額門檻
  if (
    Number(merchantSettings.value.delivery_minimum_amount) > 0 &&
    props.cartTotal >= Number(merchantSettings.value.delivery_minimum_amount)
  ) {
    return 0; // 免費外送
  }

  // 基本外送費（不管距離都要收）
  let fee = Number(merchantSettings.value.delivery_base_fee) || 0;

  // 如果有距離資料且超出免費範圍，加收每公里費用
  if (
    deliveryDistance.value !== null &&
    Number(merchantSettings.value.delivery_free_km) > 0 &&
    deliveryDistance.value > Number(merchantSettings.value.delivery_free_km)
  ) {
    const extraDistance =
      deliveryDistance.value - Number(merchantSettings.value.delivery_free_km);
    // 超過0.1公里算一公里
    const extraKm = Math.ceil(extraDistance);
    const extraFee =
      extraKm * (Number(merchantSettings.value.delivery_per_km_fee) || 0);
    fee += extraFee;
  }

  return Math.round(fee);
});

// 檢查外送選項是否可選（現在總是可選，只是會收費）
const isDeliveryAvailable = computed(() => {
  return merchantSettings.value.available_dining_types.includes('delivery');
});

// 檢查外送是否可以提交訂單（包含距離計算）
const canDeliverySubmit = computed(() => {
  if (!isDeliveryAvailable.value) {
    return false;
  }

  // 檢查距離限制
  if (merchantSettings.value.max_delivery_distance > 0) {
    // 如果沒有計算距離，不能提交
    if (deliveryDistance.value === null) {
      return false;
    }
    // 如果距離超出範圍，不能提交
    if (deliveryDistance.value > merchantSettings.value.max_delivery_distance) {
      return false;
    }
  }

  return true;
});

// 計算折扣後的總金額
const finalTotal = computed(() => {
  let total = props.cartTotal;

  // 如果是提前1天以上訂餐且有設定折扣
  if (
    orderForm.value.pickupType === 'scheduled' &&
    orderForm.value.pickupDate &&
    merchantSettings.value.advance_discount_rate > 0
  ) {
    const pickupDate = new Date(orderForm.value.pickupDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    pickupDate.setHours(0, 0, 0, 0);

    const daysDiff = (pickupDate - today) / (1000 * 60 * 60 * 24);

    if (daysDiff >= 1) {
      const discountAmount =
        total * (merchantSettings.value.advance_discount_rate / 100);
      total = total - discountAmount;
    }
  }

  // 加上外送費
  total += calculateDeliveryFee.value;

  return Math.round(total);
});

// 折扣金額（不包含外送費）
const discountAmount = computed(() => {
  let discountTotal = props.cartTotal;

  // 計算折扣後的商品金額（不含外送費）
  if (
    orderForm.value.pickupType === 'scheduled' &&
    orderForm.value.pickupDate &&
    merchantSettings.value.advance_discount_rate > 0
  ) {
    const pickupDate = new Date(orderForm.value.pickupDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    pickupDate.setHours(0, 0, 0, 0);

    const daysDiff = (pickupDate - today) / (1000 * 60 * 60 * 24);

    if (daysDiff >= 1) {
      const discountAmount =
        discountTotal * (merchantSettings.value.advance_discount_rate / 100);
      return Math.round(discountAmount);
    }
  }

  return 0;
});

// 檢查是否可以提交訂單
const canSubmitOrder = computed(() => {
  // 電話驗證檢查
  if (
    phoneError.value ||
    !orderForm.value.phone ||
    orderForm.value.phone.length !== 10
  ) {
    return false;
  }

  // 日期驗證檢查
  if (orderForm.value.pickupType === 'scheduled' && dateError.value) {
    return false;
  }

  // 外送相關檢查
  if (orderForm.value.diningType === 'delivery') {
    return canDeliverySubmit.value;
  }

  return true;
});

// 生成訂單編號
const generateOrderNumber = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = date.toTimeString().slice(0, 8).replace(/:/g, '');
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${dateStr}${timeStr}${random}`;
};

// 提交訂單
const submitOrder = async () => {
  try {
    isSubmitting.value = true;

    // 驗證必填欄位
    if (!orderForm.value.phone) {
      alert('請輸入聯絡電話');
      return;
    }

    // 驗證電話格式
    if (!validatePhoneNumber(orderForm.value.phone)) {
      alert('請輸入正確的10位數手機號碼');
      return;
    }

    if (orderForm.value.pickupType === 'scheduled') {
      if (!orderForm.value.pickupDate || !orderForm.value.pickupTime) {
        alert('請選擇預約取餐日期和時間');
        return;
      }

      // 額外檢查日期有效性（防止客戶端繞過驗證）
      validatePickupDate(orderForm.value.pickupDate);
      if (dateError.value) {
        alert(dateError.value);
        return;
      }
    }

    if (!orderForm.value.diningType) {
      alert('請選擇用餐方式');
      return;
    }

    if (!orderForm.value.paymentMethod) {
      alert('請選擇支付方式');
      return;
    }

    if (orderForm.value.diningType === 'delivery') {
      if (!orderForm.value.deliveryAddress) {
        alert('請輸入外送地址');
        return;
      }

      // 驗證地址格式
      if (!validateAddress(orderForm.value.deliveryAddress)) {
        alert('請輸入正確的台灣地址格式（包含縣市、區域、路名、門牌號碼）');
        return;
      }

      // 外送距離相關驗證已由按鈕禁用處理，這裡不需要額外檢查
    }

    // 準備訂單資料
    const orderNumber = generateOrderNumber();

    // 計算取餐時間
    let pickupDate = null;
    let pickupTime = null;

    if (orderForm.value.pickupType === 'immediate') {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30); // 加30分鐘
      pickupDate = now.toISOString().split('T')[0];
      pickupTime = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    } else {
      pickupDate = orderForm.value.pickupDate;
      pickupTime = orderForm.value.pickupTime;
    }

    const orderData = {
      orderNumber,
      merchantId: props.merchantId,
      items: props.cartItems,
      totalAmount: finalTotal.value,
      originalAmount: props.cartTotal,
      discountAmount: discountAmount.value,
      deliveryFee: calculateDeliveryFee.value,
      customerInfo: {
        phone: orderForm.value.phone,
        name: orderForm.value.customerName || '',
      },
      pickupInfo: {
        type: orderForm.value.pickupType,
        date: pickupDate,
        time: pickupTime,
      },
      diningType: orderForm.value.diningType,
      tableNumber:
        orderForm.value.diningType === 'dine-in'
          ? orderForm.value.tableNumber
          : null,
      deliveryAddress:
        orderForm.value.diningType === 'delivery'
          ? orderForm.value.deliveryAddress
          : null,
      paymentMethod: orderForm.value.paymentMethod,
      notes: orderForm.value.notes || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // 如果選擇 LINE Pay，先處理付款
    if (orderForm.value.paymentMethod === 'mobile') {
      try {
        const paymentResponse = await $fetch('/api/payment/linepay/request', {
          method: 'POST',
          body: {
            merchantId: props.merchantId,
            orderId: orderNumber,
            amount: finalTotal.value,
            productName: `訂單 ${orderNumber}`,
            redirectUrls: {
              confirmUrl: `${window.location.origin}/payment/linepay/confirm?orderId=${orderNumber}&merchantId=${props.merchantId}`,
              cancelUrl: `${window.location.origin}/menu/${props.merchantId}`,
            },
          },
        });

        if (paymentResponse.success) {
          // 儲存訂單資料到 localStorage，付款完成後會需要
          localStorage.setItem(
            `order_${orderNumber}`,
            JSON.stringify(orderData)
          );

          // 導向 LINE Pay 付款頁面
          window.location.href = paymentResponse.data.paymentUrl;
          return;
        }
      } catch (error) {
        console.error('LINE Pay 付款請求失敗:', error);
        alert('付款系統暫時無法使用，請選擇其他付款方式');
        return;
      }
    }

    // 發送訂單到顧客的 LINE（非 LINE Pay 的情況）
    try {
      await $fetch('/api/customer/send-order', {
        method: 'POST',
        body: {
          orderData,
        },
      });
      console.log('LINE 訊息發送成功');
    } catch (error) {
      console.error('LINE 訊息發送失敗:', error);
      // 即使 LINE 發送失敗，也繼續顯示成功頁面
    }

    // 觸發訂單完成事件
    emit('order-submitted', {
      orderNumber,
      orderData,
    });
  } catch (error) {
    console.error('提交訂單失敗:', error);
    alert('訂單提交失敗，請稍後再試');
  } finally {
    isSubmitting.value = false;
  }
};

// 地址驗證正則表達式
const validateAddress = (address) => {
  // 台灣地址格式驗證：縣市 + 區域 + 路段 + 門牌號碼
  const taiwanAddressPattern =
    /^(台北市|新北市|桃園市|台中市|台南市|高雄市|基隆市|新竹市|嘉義市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義縣|屏東縣|宜蘭縣|花蓮縣|台東縣|澎湖縣|金門縣|連江縣).+(區|鄉|鎮|市).+(路|街|巷|弄|號|村|里).+\d+/;

  if (!taiwanAddressPattern.test(address)) {
    return false;
  }

  return true;
};

// 日期驗證函數
const validatePickupDate = (selectedDate) => {
  if (!selectedDate) {
    dateError.value = '';
    return;
  }

  const selected = new Date(selectedDate);
  const min = new Date(minDate.value);
  const max = new Date(maxDate.value);

  if (selected < min) {
    if (props.isAdvanceOrderingMode) {
      dateError.value = '預約取餐最早只能選擇明天';
    } else {
      dateError.value = '取餐日期不能早於今天';
    }
    return;
  }

  if (selected > max) {
    dateError.value = '取餐日期最多只能預約14天內';
    return;
  }

  // 檢查該日期是否為休假日
  const isHoliday = merchantSettings.value.special_hours.some((specialHour) => {
    const specialDate = new Date(specialHour.date);
    const compareDate = new Date(selected);
    specialDate.setHours(0, 0, 0, 0);
    compareDate.setHours(0, 0, 0, 0);
    return (
      specialDate.getTime() === compareDate.getTime() && !specialHour.is_open
    );
  });

  if (isHoliday) {
    const holidayInfo = merchantSettings.value.special_hours.find(
      (specialHour) => {
        const specialDate = new Date(specialHour.date);
        const compareDate = new Date(selected);
        specialDate.setHours(0, 0, 0, 0);
        compareDate.setHours(0, 0, 0, 0);
        return specialDate.getTime() === compareDate.getTime();
      }
    );
    dateError.value = `該日期為休假日${
      holidayInfo?.reason ? `(${holidayInfo.reason})` : ''
    }，無法預約取餐`;
    return;
  }

  // 檢查該星期幾是否營業
  const dayOfWeek = selected.getDay();
  const businessHour = merchantSettings.value.business_hours.find(
    (bh) => bh.day_of_week === dayOfWeek
  );

  if (!businessHour || !businessHour.is_open) {
    const dayNames = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    dateError.value = `${dayNames[dayOfWeek]}不營業，無法預約取餐`;
    return;
  }

  dateError.value = '';
};

// 電話號碼驗證函數
const validatePhoneNumber = (phone) => {
  // 台灣手機號碼格式：09開頭，共10位數字
  const phonePattern = /^09\d{8}$/;
  return phonePattern.test(phone);
};

// 即時電話驗證
const validatePhone = () => {
  const phone = orderForm.value.phone;

  if (!phone) {
    phoneError.value = '';
    return;
  }

  // 只允許數字
  const numericPhone = phone.replace(/\D/g, '');
  if (numericPhone !== phone) {
    orderForm.value.phone = numericPhone;
    return;
  }

  if (phone.length < 10) {
    phoneError.value = '手機號碼需要10位數字';
    return;
  }

  if (phone.length > 10) {
    phoneError.value = '手機號碼不能超過10位數字';
    return;
  }

  if (!validatePhoneNumber(phone)) {
    phoneError.value = '請輸入以09開頭的手機號碼';
    return;
  }

  phoneError.value = '';
};

// 重置距離計算
const resetDistanceCalculation = () => {
  deliveryDistance.value = null;
  distanceError.value = '';
};

// 計算距離
const calculateDistance = async () => {
  if (!orderForm.value.deliveryAddress) {
    distanceError.value = '請先輸入外送地址';
    return;
  }

  // 驗證地址格式
  if (!validateAddress(orderForm.value.deliveryAddress)) {
    distanceError.value =
      '請輸入正確的台灣地址格式（包含縣市、區域、路名、門牌號碼）';
    return;
  }

  isCalculatingDistance.value = true;
  distanceError.value = '';

  try {
    // 調用距離計算API
    const response = await $fetch('/api/calculate-distance', {
      method: 'POST',
      body: {
        merchantId: props.merchantId,
        customerAddress: orderForm.value.deliveryAddress,
      },
    });

    if (response.success) {
      deliveryDistance.value = response.distance;

      // 檢查是否超過最大外送距離
      if (
        merchantSettings.value.max_delivery_distance > 0 &&
        response.distance > merchantSettings.value.max_delivery_distance
      ) {
        distanceError.value = `外送距離 ${response.distance} 公里超過最大外送範圍 ${merchantSettings.value.max_delivery_distance} 公里`;
      }
    } else {
      distanceError.value =
        response.error || '無法計算距離，請檢查地址是否正確';
    }
  } catch (error) {
    console.error('計算距離失敗:', error);
    distanceError.value = '距離計算失敗，請稍後再試';
  } finally {
    isCalculatingDistance.value = false;
  }
};

// 監聽取餐日期變化並驗證
watch(
  () => orderForm.value.pickupDate,
  (newDate) => {
    validatePickupDate(newDate);

    // 如果選擇的時間不在新日期的可用時間內，重置時間選擇
    if (orderForm.value.pickupTime) {
      // 等待 availableTimes 重新計算後檢查
      nextTick(() => {
        if (!availableTimes.value.includes(orderForm.value.pickupTime)) {
          orderForm.value.pickupTime = '';
        }
      });
    }
  }
);

// 組件掛載時載入商家設定
onMounted(() => {
  loadMerchantSettings();
});
</script>
