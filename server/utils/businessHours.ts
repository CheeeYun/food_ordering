import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * 檢查指定時間是否在營業時間內
 */
export async function isWithinBusinessHours(
  merchantId: number, 
  dateTime: Date = new Date()
): Promise<boolean> {
  try {
    const date = new Date(dateTime)
    const dayOfWeek = date.getDay() // 0=Sunday, 1=Monday...6=Saturday
    const currentTime = formatTime(date)
    const dateOnly = formatDate(date)

    // 1. 首先檢查特殊營業時間
    const specialHour = await prisma.storeSpecialHour.findFirst({
      where: {
        merchant_id: merchantId,
        date: new Date(dateOnly)
      }
    })

    if (specialHour) {
      if (!specialHour.is_open) {
        return false // 特殊休假日
      }
      // 檢查特殊營業時間
      if (specialHour.open_time && specialHour.close_time) {
        return isTimeInRange(currentTime, specialHour.open_time, specialHour.close_time)
      }
      return true // 特殊開放日，無時間限制
    }

    // 2. 檢查一般營業時間
    const businessHour = await prisma.storeBusinessHour.findFirst({
      where: {
        merchant_id: merchantId,
        day_of_week: dayOfWeek
      }
    })

    if (!businessHour || !businessHour.is_open) {
      return false // 今日不營業
    }

    if (!businessHour.open_time || !businessHour.close_time) {
      return true // 全天營業
    }

    // 檢查是否在營業時間內（考慮午休時間）
    const inMainHours = isTimeInRange(currentTime, businessHour.open_time, businessHour.close_time)
    
    if (!inMainHours) {
      return false
    }

    // 檢查是否在午休時間
    if (businessHour.break_start_time && businessHour.break_end_time) {
      const inBreakTime = isTimeInRange(currentTime, businessHour.break_start_time, businessHour.break_end_time)
      if (inBreakTime) {
        return false
      }
    }

    return true

  } catch (error) {
    console.error('Error checking business hours:', error)
    return true // 發生錯誤時默認開放
  }
}

/**
 * 根據營業時間自動更新商家的 is_active 狀態
 */
export async function updateMerchantActiveStatus(
  merchantId: number, 
  dateTime: Date = new Date()
): Promise<boolean> {
  try {
    const shouldBeActive = await isWithinBusinessHours(merchantId, dateTime)
    
    await prisma.merchant.update({
      where: { id: merchantId },
      data: { is_active: shouldBeActive ? 1 : 0 }
    })

    return shouldBeActive
  } catch (error) {
    console.error('Error updating merchant active status:', error)
    return false
  }
}

/**
 * 批量更新所有商家的營業狀態（用於定時任務）
 */
export async function updateAllMerchantsActiveStatus(dateTime: Date = new Date()): Promise<void> {
  try {
    const merchants = await prisma.merchant.findMany({
      select: { id: true }
    })

    const updatePromises = merchants.map(merchant => 
      updateMerchantActiveStatus(merchant.id, dateTime)
    )

    await Promise.all(updatePromises)
    console.log(`Updated ${merchants.length} merchants' active status`)
  } catch (error) {
    console.error('Error updating all merchants active status:', error)
  }
}


/**
 * 獲取商家的營業狀態信息
 */
export async function getMerchantBusinessStatus(merchantId: number, dateTime: Date = new Date()) {
  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      select: { is_active: true, store_name: true }
    })

    if (!merchant) {
      throw new Error('Merchant not found')
    }

    const isInBusinessHours = await isWithinBusinessHours(merchantId, dateTime)
    const date = new Date(dateTime)
    const dayOfWeek = date.getDay()
    const dateOnly = formatDate(date)

    // 檢查今日營業時間設定
    const specialHour = await prisma.storeSpecialHour.findFirst({
      where: {
        merchant_id: merchantId,
        date: new Date(dateOnly)
      }
    })

    const businessHour = await prisma.storeBusinessHour.findFirst({
      where: {
        merchant_id: merchantId,
        day_of_week: dayOfWeek
      }
    })

    return {
      isActive: merchant.is_active === 1,
      isInBusinessHours,
      finalStatus: merchant.is_active === 1 && isInBusinessHours,
      specialHour,
      businessHour,
      currentTime: formatTime(date),
      currentDate: dateOnly
    }
  } catch (error) {
    console.error('Error getting merchant business status:', error)
    throw error
  }
}

/**
 * 獲取下一個營業時間
 */
export async function getNextBusinessHour(merchantId: number, fromDate: Date = new Date()) {
  try {
    const startDate = new Date(fromDate)
    
    // 檢查接下來7天內的營業時間
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(startDate)
      checkDate.setDate(startDate.getDate() + i)
      
      const dayOfWeek = checkDate.getDay()
      const dateOnly = formatDate(checkDate)

      // 檢查特殊時間
      const specialHour = await prisma.storeSpecialHour.findFirst({
        where: {
          merchant_id: merchantId,
          date: new Date(dateOnly)
        }
      })

      if (specialHour) {
        if (specialHour.is_open && specialHour.open_time) {
          return {
            date: dateOnly,
            openTime: specialHour.open_time,
            closeTime: specialHour.close_time,
            isSpecial: true,
            reason: specialHour.reason
          }
        }
        continue // 特殊休假日，跳過
      }

      // 檢查一般營業時間
      const businessHour = await prisma.storeBusinessHour.findFirst({
        where: {
          merchant_id: merchantId,
          day_of_week: dayOfWeek
        }
      })

      if (businessHour && businessHour.is_open && businessHour.open_time) {
        return {
          date: dateOnly,
          openTime: businessHour.open_time,
          closeTime: businessHour.close_time,
          isSpecial: false,
          breakStartTime: businessHour.break_start_time,
          breakEndTime: businessHour.break_end_time
        }
      }
    }

    return null // 7天內沒有營業時間
  } catch (error) {
    console.error('Error getting next business hour:', error)
    return null
  }
}

// 輔助函數
function formatTime(date: Date): string {
  return date.toTimeString().substring(0, 8) // HH:MM:SS
}

function formatDate(date: Date): string {
  return date.toISOString().substring(0, 10) // YYYY-MM-DD
}

function isTimeInRange(currentTime: string, startTime: string, endTime: string): boolean {
  // 處理跨午夜的情況
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime <= endTime
  }
  return currentTime >= startTime && currentTime <= endTime
}