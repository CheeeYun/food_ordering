import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const merchantId = getRouterParam(event, 'merchantId');

  if (!merchantId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Merchant ID is required',
    });
  }

  try {
    // 取得商家公開資訊
    const merchant = await prisma.merchant.findUnique({
      where: { lineId: merchantId },
      select: {
        id: true,
        store_name: true,
        store_description: true,
        phone: true,
        email: true,
        address: true,
        is_active: true,
        order_service_active: true,
        line_channel_id: true, // 檢查是否已設定 LINE channel
        available_dining_types: true,
        available_payment_methods: true,
        advance_discount_rate: true,
        delivery_minimum_amount: true,
        delivery_base_fee: true,
        delivery_free_km: true,
        delivery_per_km_fee: true,
        delivery_prepayment: true,
        max_delivery_distance: true,
        bank_account: true,
        manual_override_until_midnight: true,
        last_reset_date: true,
      },
    });

    if (!merchant) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Merchant not found',
      });
    }

    // 取得營業時間
    const businessHours = await prisma.storeBusinessHour.findMany({
      where: { merchant_id: merchant.id },
      orderBy: { day_of_week: 'asc' }
    });

    // 取得特殊營業時間（未來30天的休假日期）
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const thirtyDaysLater = new Date(todayStart)
    thirtyDaysLater.setDate(todayStart.getDate() + 30)

    const specialHours = await prisma.storeSpecialHour.findMany({
      where: { 
        merchant_id: merchant.id,
        date: {
          gte: todayStart,
          lte: thirtyDaysLater
        }
      },
      orderBy: { date: 'asc' }
    });

    // 檢查商家是否已完成 LINE 設定
    const isLineConfigured = !!(merchant.line_channel_id);

    return {
      success: true,
      data: {
        store_name: merchant.store_name,
        store_description: merchant.store_description,
        phone: merchant.phone,
        email: merchant.email,
        address: merchant.address,
        is_active: merchant.is_active,
        order_service_active: merchant.order_service_active,
        is_line_configured: isLineConfigured,
        available_dining_types: merchant.available_dining_types,
        available_payment_methods: merchant.available_payment_methods,
        advance_discount_rate: merchant.advance_discount_rate,
        delivery_minimum_amount: merchant.delivery_minimum_amount,
        delivery_base_fee: merchant.delivery_base_fee,
        delivery_free_km: merchant.delivery_free_km,
        delivery_per_km_fee: merchant.delivery_per_km_fee,
        delivery_prepayment: merchant.delivery_prepayment,
        max_delivery_distance: merchant.max_delivery_distance,
        bank_account: merchant.bank_account,
        manual_override_until_midnight: merchant.manual_override_until_midnight,
        last_reset_date: merchant.last_reset_date,
        business_hours: businessHours,
        special_hours: specialHours,
      },
    };
  } catch (error) {
    console.error('Failed to get merchant info:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load merchant information',
    });
  }
});