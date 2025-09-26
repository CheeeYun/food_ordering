import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { merchantId } = body
    
    if (!merchantId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Merchant ID is required'
      })
    }

    // 檢查是否為新的一天 - 只有當日期改變時才重置手動控制標記
    const now = new Date()
    const today = now.toISOString().substring(0, 10) // YYYY-MM-DD
    
    // 獲取商家當前的重置日期記錄
    const merchant = await prisma.merchant.findUnique({
      where: { lineId: merchantId },
      select: { last_reset_date: true, manual_override_until_midnight: true }
    })
    
    let shouldReset = false
    
    // 如果沒有記錄重置日期，或者日期已經改變，則需要重置
    if (!merchant?.last_reset_date || merchant.last_reset_date !== today) {
      shouldReset = merchant?.manual_override_until_midnight === 1
      
      if (shouldReset) {
        await prisma.merchant.update({
          where: { lineId: merchantId },
          data: { 
            manual_override_until_midnight: 0,
            last_reset_date: today
          }
        })
      } else {
        // 即使沒有重置，也更新重置日期記錄
        await prisma.merchant.update({
          where: { lineId: merchantId },
          data: { last_reset_date: today }
        })
      }
    }

    return {
      success: true,
      reset: shouldReset
    }
  } catch (error) {
    console.error('Error resetting manual override for customer:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to reset manual override'
    })
  }
})