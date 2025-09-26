import jwt from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';
import {getMerchantBusinessStatus} from '../../utils/businessHours';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  console.log('=== 開始處理訂單 ===');

  try {
    const config = useRuntimeConfig();
    const body = await readBody(event);
    const {orderData} = body;

    if (!orderData) {
      console.log('錯誤：缺少訂單資料');
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing order data',
      });
    }

    // 從 cookie 中取得客戶 JWT token
    const customerToken = getCookie(event, 'customer-auth-token');
    if (!customerToken) {
      console.log('錯誤：客戶未認證');
      throw createError({
        statusCode: 401,
        statusMessage: 'Customer not authenticated',
      });
    }

    // 解析 JWT token 取得客戶資訊
    let customerInfo;
    try {
      customerInfo = jwt.verify(customerToken, config.jwtSecret) as any;
      console.log('JWT 驗證成功，商家ID:', customerInfo.merchantId);
    } catch (error) {
      console.log('錯誤：JWT token 無效');
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid customer token',
      });
    }

    const {
      lineId: customerLineId,
      merchantChannelAccessToken,
      merchantId,
    } = customerInfo;

    // 檢查商家營業狀態
    const businessStatus = await getMerchantBusinessStatus(merchantId);

    // 取得商家的手動控制狀態
    const merchantInfo = await prisma.merchant.findUnique({
      where: {id: merchantId},
      select: {
        is_active: true,
        manual_override_until_midnight: true,
      },
    });

    // 如果不是預約訂單，需要檢查當前營業狀態
    const isScheduledOrder =
      orderData.pickupInfo?.type === 'scheduled' &&
      orderData.pickupInfo?.date &&
      orderData.pickupInfo.date !== new Date().toISOString().substring(0, 10);

    // 如果是手動控制且已開啟，則允許接單
    const isManuallyOpen =
      merchantInfo?.manual_override_until_midnight === 1 &&
      merchantInfo?.is_active === 1;

    console.log('營業狀態檢查:', {
      isScheduledOrder,
      finalStatus: businessStatus.finalStatus,
      isActive: businessStatus.isActive,
      isInBusinessHours: businessStatus.isInBusinessHours,
      isManuallyOpen,
    });

    if (!isScheduledOrder && !businessStatus.finalStatus && !isManuallyOpen) {
      let errorMessage = '店家目前未營業';

      console.log('營業狀態檢查失敗:', {
        isScheduledOrder,
        finalStatus: businessStatus.finalStatus,
        isActive: businessStatus.isActive,
        isInBusinessHours: businessStatus.isInBusinessHours,
      });

      if (!businessStatus.isActive) {
        errorMessage = '店家目前暫停營業';
      } else if (!businessStatus.isInBusinessHours) {
        if (businessStatus.businessHour) {
          const {open_time, close_time} = businessStatus.businessHour;
          errorMessage = `店家營業時間：${open_time?.substring(
            0,
            5
          )} - ${close_time?.substring(0, 5)}`;
        } else {
          errorMessage = '店家今日未營業';
        }
      }

      console.log('拋出 400 錯誤:', errorMessage);
      throw createError({
        statusCode: 400,
        statusMessage: errorMessage,
      });
    }

    // 取得商家的 Telegram chat ID 和銀行帳號
    const merchantData = await prisma.merchant.findUnique({
      where: {id: merchantId},
      select: {
        telegram_chat_id: true,
        store_name: true,
        bank_account: true,
      },
    });

    // 檢查是否為提前訂餐（享有優惠）
    const isAdvanceOrder =
      orderData.discountAmount && orderData.discountAmount > 0;

    // 建立訂單項目的 flex message 內容
    const itemElements = orderData.items.map((item: any) => {
      const optionsText = [];

      // 處理選項群組選擇
      if (
        item.selectedGroupOptions &&
        Object.keys(item.selectedGroupOptions).length > 0
      ) {
        Object.values(item.selectedGroupOptions).forEach((groupData: any) => {
          const optionNames = groupData.selectedOptions
            .map((opt: any) => opt.name)
            .join(', ');
          optionsText.push(`${groupData.groupName}: ${optionNames}`);
        });
      }
      // 向後相容：處理傳統選項
      else if (item.selectedOption) {
        optionsText.push(item.selectedOption.name);
      }

      return {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: `${item.name} x${item.quantity}`,
                weight: 'bold',
                size: 'sm',
                color: '#000000',
                wrap: true,
              },
              ...(optionsText.length > 0
                ? [
                    {
                      type: 'text',
                      text: optionsText.join(', ').substring(0, 100),
                      size: 'xxs',
                      color: '#9ca3af',
                      wrap: true,
                      margin: 'xs',
                    },
                  ]
                : []),
            ],
            flex: 3,
          },
          {
            type: 'text',
            text: `$${(item.totalPrice * item.quantity).toFixed(0)}`,
            align: 'end',
            size: 'sm',
            color: '#2563eb',
            weight: 'bold',
            flex: 1,
          },
        ],
        spacing: 'sm',
        margin: 'sm',
      };
    });

    // 建立 flex message
    const flexMessage = {
      type: 'flex',
      altText: `訂單確認 - ${orderData.orderNumber}`,
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '🚀 我們已收到您的訂單',
              weight: 'bold',
              size: 'xl',
              color: '#22c55e',
            },
            {
              type: 'text',
              text: `訂單編號：${orderData.orderNumber}`,
              size: 'sm',
              color: '#666666',
              margin: 'md',
            },
          ],
          paddingAll: '20px',
          backgroundColor: '#f0fdf4',
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '訂單摘要',
              weight: 'bold',
              size: 'md',
              margin: 'md',
            },
            {
              type: 'separator',
              margin: 'md',
            },
            ...itemElements,
            {
              type: 'separator',
              margin: 'xl',
            },
            // 費用明細區域
            {
              type: 'box',
              layout: 'vertical',
              contents: [
                // 原價顯示（如有折扣）
                ...(orderData.discountAmount > 0
                  ? [
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '小計',
                            size: 'sm',
                            color: '#6b7280',
                          },
                          {
                            type: 'text',
                            text: `$${orderData.originalAmount}`,
                            size: 'sm',
                            color: '#6b7280',
                            align: 'end',
                            decoration: 'line-through',
                          },
                        ],
                      },
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '預訂優惠',
                            size: 'sm',
                            color: '#f6077aff',
                            weight: 'bold',
                          },
                          {
                            type: 'text',
                            text: `-$${orderData.discountAmount}`,
                            size: 'sm',
                            color: '#f6077aff',
                            align: 'end',
                            weight: 'bold',
                          },
                        ],
                        margin: 'xs',
                      },
                    ]
                  : []),
                // 外送費顯示
                ...(orderData.deliveryFee && orderData.deliveryFee > 0
                  ? [
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '外送費',
                            size: 'sm',
                            color: '#6b7280',
                          },
                          {
                            type: 'text',
                            text: `$${orderData.deliveryFee}`,
                            size: 'sm',
                            color: '#6b7280',
                            align: 'end',
                          },
                        ],
                        margin: orderData.discountAmount > 0 ? 'xs' : 'none',
                      },
                    ]
                  : []),
              ],
              margin: 'sm',
              spacing: 'xs',
            },
            // 總計區域
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: '總金額',
                  weight: 'bold',
                  size: 'md',
                  color: '#000000',
                },
                {
                  type: 'text',
                  text: `$${orderData.totalAmount}`,
                  weight: 'bold',
                  size: 'lg',
                  color: '#2563eb',
                  align: 'end',
                },
              ],
              margin: 'sm',
            },
            {
              type: 'separator',
              margin: 'xl',
            },
            {
              type: 'text',
              text: '取餐資訊',
              weight: 'bold',
              size: 'sm',
              margin: 'sm',
              color: '#374151',
            },
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'xs',
              contents: [
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '取餐方式',
                      size: 'sm',
                      color: '#666666',
                      flex: 2,
                    },
                    {
                      type: 'text',
                      text:
                        orderData.pickupInfo.type === 'immediate'
                          ? '立即取餐'
                          : '預約取餐',
                      size: 'sm',
                      align: 'end',
                      flex: 3,
                    },
                  ],
                },
                ...(orderData.pickupInfo.date
                  ? [
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text:
                              orderData.pickupInfo.type === 'immediate'
                                ? '預計取餐時間'
                                : '預約時間',
                            size: 'sm',
                            color: '#666666',
                            flex: 2,
                          },
                          {
                            type: 'text',
                            text: `${orderData.pickupInfo.date} ${orderData.pickupInfo.time}`,
                            size: 'sm',
                            align: 'end',
                            flex: 3,
                            color: isAdvanceOrder ? '#dc2626' : '#059669',
                            weight: isAdvanceOrder ? 'bold' : 'normal',
                          },
                        ],
                        margin: 'sm',
                      },
                    ]
                  : []),
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '用餐方式',
                      size: 'sm',
                      color: '#666666',
                      flex: 2,
                    },
                    {
                      type: 'text',
                      text:
                        orderData.diningType === 'takeaway'
                          ? '外帶'
                          : orderData.diningType === 'dine-in'
                          ? '內用'
                          : '外送',
                      size: 'sm',
                      align: 'end',
                      flex: 3,
                    },
                  ],
                  margin: 'sm',
                },
                ...(orderData.tableNumber
                  ? [
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '桌號',
                            size: 'sm',
                            color: '#666666',
                            flex: 2,
                          },
                          {
                            type: 'text',
                            text: orderData.tableNumber,
                            size: 'sm',
                            align: 'end',
                            flex: 3,
                          },
                        ],
                        margin: 'sm',
                      },
                    ]
                  : []),
                ...(orderData.deliveryAddress
                  ? [
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '外送地址',
                            size: 'sm',
                            color: '#666666',
                            flex: 2,
                          },
                          {
                            type: 'text',
                            text: orderData.deliveryAddress,
                            size: 'sm',
                            align: 'end',
                            flex: 3,
                            wrap: true,
                          },
                        ],
                        margin: 'sm',
                      },
                    ]
                  : []),
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '支付方式',
                      size: 'sm',
                      color: '#666666',
                      flex: 2,
                    },
                    {
                      type: 'text',
                      text:
                        orderData.paymentMethod === 'cash'
                          ? '現金付款'
                          : orderData.paymentMethod === 'bank_transfer'
                          ? '銀行轉帳'
                          : 'LINE Pay',
                      size: 'sm',
                      align: 'end',
                      flex: 3,
                    },
                  ],
                  margin: 'sm',
                },
                // LINE Pay 付款狀態顯示
                ...(orderData.paymentMethod === 'mobile'
                  ? [
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '付款狀態',
                            size: 'sm',
                            color: '#666666',
                            flex: 2,
                          },
                          {
                            type: 'text',
                            text: '✅ 已付款',
                            size: 'sm',
                            align: 'end',
                            flex: 3,
                            color: '#22c55e',
                            weight: 'bold',
                          },
                        ],
                        margin: 'sm',
                      },
                    ]
                  : []),
              ],
            },
            // 銀行轉帳資訊區塊
            ...(orderData.paymentMethod === 'bank_transfer' &&
            merchantData?.bank_account
              ? [
                  {
                    type: 'separator',
                    margin: 'xl',
                  },
                  {
                    type: 'text',
                    text: '銀行轉帳資訊',
                    weight: 'bold',
                    size: 'md',
                    margin: 'md',
                    color: '#2563eb',
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'text',
                            text: '收款帳號',
                            size: 'sm',
                            color: '#666666',
                          },
                          {
                            type: 'text',
                            text: merchantData.bank_account,
                            weight: 'bold',
                            size: 'md',
                            color: '#1f2937',
                            margin: 'xs',
                          },
                        ],
                        backgroundColor: '#f8fafc',
                        paddingAll: '12px',
                        cornerRadius: '8px',
                        margin: 'sm',
                      },
                      {
                        type: 'text',
                        text: '付款說明：',
                        weight: 'bold',
                        size: 'sm',
                        color: '#dc2626',
                        margin: 'md',
                      },
                      {
                        type: 'text',
                        text: '• 請於出餐前完成轉帳\n• 轉帳後請將匯款明細截圖傳至本聊天室\n• 商家確認收款後才會開始準備餐點',
                        size: 'xs',
                        color: '#666666',
                        margin: 'sm',
                        wrap: true,
                      },
                    ],
                    margin: 'md',
                  },
                ]
              : []),
            ...(orderData.customerInfo.phone
              ? [
                  {
                    type: 'separator',
                    margin: 'xl',
                  },
                  {
                    type: 'text',
                    text: '聯絡資訊',
                    weight: 'bold',
                    size: 'md',
                    margin: 'md',
                  },
                  {
                    type: 'text',
                    text: `手機：${orderData.customerInfo.phone}`,
                    size: 'sm',
                    margin: 'sm',
                  },
                ]
              : []),
            ...(orderData.notes
              ? [
                  {
                    type: 'separator',
                    margin: 'xl',
                  },
                  {
                    type: 'text',
                    text: '特殊需求',
                    weight: 'bold',
                    size: 'md',
                    margin: 'md',
                  },
                  {
                    type: 'text',
                    text: orderData.notes,
                    size: 'sm',
                    margin: 'sm',
                    wrap: true,
                  },
                ]
              : []),
          ],
          paddingAll: '20px',
        },
        ...(orderData.diningType === 'takeaway'
          ? {
              footer: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: '溫馨提醒',
                    weight: 'bold',
                    size: 'sm',
                    color: '#2563eb',
                  },
                  {
                    type: 'text',
                    text:
                      orderData.pickupInfo.type === 'immediate'
                        ? '請約30分鐘後到店取餐，謝謝！'
                        : '請於預約時間到店取餐，謝謝！',
                    size: 'xs',
                    color: '#666666',
                    margin: 'sm',
                    wrap: true,
                  },
                ],
                paddingAll: '20px',
                backgroundColor: '#f8fafc',
              },
            }
          : {}),
      },
    };

    // 發送 LINE message
    console.log('準備發送 LINE 訊息:', {
      to: customerLineId,
      messageType: flexMessage.type,
      altText: flexMessage.altText,
    });

    // 檢查 flexMessage 結構
    console.log('FlexMessage 結構檢查:', JSON.stringify(flexMessage, null, 2));

    let lineSendSuccess = true;
    let lineErrorMessage = '';

    try {
      const lineResponse = await $fetch(
        'https://api.line.me/v2/bot/message/push',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${merchantChannelAccessToken}`,
          },
          body: {
            to: customerLineId,
            messages: [flexMessage],
          },
        }
      );
      console.log('LINE 訊息發送成功');
    } catch (lineError) {
      console.error('LINE 訊息發送失敗:', lineError);
      lineSendSuccess = false;
      console.log('設定 lineSendSuccess 為 false, 繼續執行後續流程');

      // 解析 LINE API 錯誤訊息
      if (lineError.data && lineError.data.details) {
        const details = lineError.data.details[0];
        if (details && details.message) {
          lineErrorMessage = details.message;
        }
      } else if (lineError.data && lineError.data.message) {
        lineErrorMessage = lineError.data.message;
      } else {
        lineErrorMessage = lineError.message || '未知錯誤';
      }
    }

    // 更新商品點擊次數（完成交易後）
    try {
      for (const item of orderData.items) {
        if (item.productId) {
          await prisma.product.update({
            where: {id: parseInt(item.productId)},
            data: {
              count: {
                increment: item.quantity || 1,
              },
            },
          });
        }
      }
      console.log('商品點擊次數更新成功');
    } catch (countError) {
      console.error('更新商品點擊次數失敗:', countError);
      // 不中斷流程，即使更新失敗
    }

    // 更新商家累積訂單數和累積金額
    try {
      await prisma.merchant.update({
        where: {id: merchantId},
        data: {
          total_orders: {
            increment: 1,
          },
          total_revenue: {
            increment: parseFloat(orderData.totalAmount.toString()),
          },
        },
      });
      console.log('商家統計資料更新成功');
    } catch (statsError) {
      console.error('更新商家統計資料失敗:', statsError);
      // 不中斷流程，即使更新失敗
    }

    console.log('準備發送 Telegram 訊息, lineSendSuccess:', lineSendSuccess);

    // 發送 Telegram 訊息給商家
    if (merchantData?.telegram_chat_id && config.telegramBotToken) {
      console.log('Telegram 條件滿足，開始發送');
      try {
        // 建立純文字訂單摘要
        const itemsList = orderData.items
          .map((item: any, index: number) => {
            let itemText = `<b>${index + 1}. ${item.name}</b> x<b>${
              item.quantity
            }</b> - <code>$${(item.totalPrice * item.quantity).toFixed(
              0
            )}</code>`;

            // 處理選項
            const optionsText = [];
            if (
              item.selectedGroupOptions &&
              Object.keys(item.selectedGroupOptions).length > 0
            ) {
              Object.values(item.selectedGroupOptions).forEach(
                (groupData: any) => {
                  const optionNames = groupData.selectedOptions
                    .map((opt: any) => opt.name)
                    .join(', ');
                  optionsText.push(`${groupData.groupName}: ${optionNames}`);
                }
              );
            } else if (item.selectedOption) {
              optionsText.push(item.selectedOption.name);
            }

            if (optionsText.length > 0) {
              itemText += `\n   <i>└ ${optionsText.join(', ')}</i>`;
            }

            return itemText;
          })
          .join('\n\n');

        // 檢查是否為預定單（非今天）
        const today = new Date().toISOString().split('T')[0];
        const isAdvanceOrder =
          orderData.pickupInfo.date && orderData.pickupInfo.date !== today;

        const telegramMessage = `${
          !lineSendSuccess ? '<b>🚨 LINE 訊息發送失敗警告</b>\n\n' : ''
        }${isAdvanceOrder ? '<b>⚠️ 預定單警示</b>\n\n' : ''}🚀 <b>新訂單通知</b>
<b>訂單編號：</b><code>${orderData.orderNumber}</code>
<b>店家：</b>${merchantData.store_name || '未設定'}
━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━
<b>📦訂單內容：</b>
${itemsList}${
          orderData.discountAmount && orderData.discountAmount > 0
            ? `\n<b>小計：</b><s>$${orderData.originalAmount}</s>\n<b>預訂優惠：</b><code>-$${orderData.discountAmount}</code>`
            : ''
        }${
          orderData.deliveryFee && orderData.deliveryFee > 0
            ? `\n<b>🚚外送費：</b><code>$${orderData.deliveryFee}</code>`
            : ''
        }
<b>總金額：</b><code>$${orderData.totalAmount}</code>
━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━
<b>顧客資訊：</b>
<b>訂購人：</b>${orderData.customerInfo.name || '未提供'}
<b>帳號名：</b>${customerInfo.name || '未提供'}
<b>電話：</b>${orderData.customerInfo.phone || '未提供電話'}
<b>取餐方式：</b>${
          orderData.pickupInfo.type === 'immediate'
            ? '<b>立即取餐</b>'
            : isAdvanceOrder
            ? '<b>⚠️預定單(非當日)</b>'
            : '<b>預約取餐(當日)</b>'
        }
${
  orderData.pickupInfo.date
    ? `<b>${
        orderData.pickupInfo.type === 'immediate' ? '預計' : '預約'
      }時間：</b>${isAdvanceOrder ? '<b>' : ''}<code>${
        orderData.pickupInfo.date
      } ${orderData.pickupInfo.time}</code>${isAdvanceOrder ? '</b>' : ''}\n`
    : ''
}<b>用餐方式：</b>${
          orderData.diningType === 'takeaway'
            ? '<b>🥡外帶</b>'
            : orderData.diningType === 'dine-in'
            ? '<b>🍽️ 內用</b>'
            : '<b>🚚 外送</b>'
        }
${
  orderData.tableNumber
    ? `<b>桌號：</b><code>${orderData.tableNumber}</code>\n`
    : ''
}${
          orderData.deliveryAddress
            ? `<b>外送地址：</b>${orderData.deliveryAddress}\n`
            : ''
        }<b>支付方式：</b>${
          orderData.paymentMethod === 'cash'
            ? '<b>💵 現場付款</b>'
            : orderData.paymentMethod === 'bank_transfer'
            ? '<b>🏦 銀行轉帳</b>'
            : '<b>📱 LINE Pay (已付款)</b>'
        }
${
  orderData.notes
    ? `━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━\n<b>特殊需求：</b>\n<i>${orderData.notes}</i>\n\n`
    : ''
}${
          !lineSendSuccess
            ? `━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━\n<b>🚨 重要警告：LINE 訊息發送失敗</b>\n<b>錯誤原因：</b><code>${lineErrorMessage}</code>\n<b>⚠️ 顧客未收到訂單確認訊息</b>\n<b>🔔 請主動致電顧客確認訂單內容</b>\n<b>📞 顧客電話：</b>${
                orderData.customerInfo.phone || '未提供'
              }\n\n<b>💡 可能原因：</b>\n• LINE 訊息用量已超過月費方案額度\n• LINE ACCESS_TOKEN設定錯誤\n• 請前往 LINE Business Manager 檢查用量\n• 建議升級至適合的訊息方案\n\n`
            : ''
        }━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━
<b>訂單時間：</b><code>${new Date().toLocaleString('zh-TW', {
          timeZone: 'Asia/Taipei',
        })}</code>`;

        await $fetch(
          `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              chat_id: merchantData.telegram_chat_id,
              text: telegramMessage,
              parse_mode: 'HTML',
            },
          }
        );

        console.log('Telegram 訊息發送成功');
      } catch (telegramError) {
        console.error('Telegram 訊息發送失敗:', telegramError);
        // 不中斷流程，即使 Telegram 發送失敗
      }
    }

    return {
      success: true,
      message: lineSendSuccess
        ? 'Order sent to customer via LINE and merchant via Telegram'
        : 'Order processed. LINE message failed but merchant notified via Telegram',
      lineSendSuccess,
      lineErrorMessage: lineSendSuccess ? null : lineErrorMessage,
    };
  } catch (error) {
    console.error('訂單處理過程中發生錯誤:', error);
    console.error('錯誤詳細信息:', {
      status: error.status,
      statusCode: error.statusCode,
      statusText: error.statusText,
      data: error.data,
      message: error.message,
    });

    // 重新拋出錯誤
    throw error;
  }
});
