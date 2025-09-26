import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth-token')
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No token provided'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const merchantId = decoded.merchantId

    // 先清理該商家過期的休假日期（今天之前，不包含今天）
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const deleteResult = await prisma.storeSpecialHour.deleteMany({
      where: {
        merchant_id: merchantId,
        date: {
          lt: today
        }
      }
    })

    if (deleteResult.count > 0) {
      console.log(`Deleted ${deleteResult.count} expired special hours for merchant ${merchantId}`)
    }

    // 獲取一般營業時間
    const businessHours = await prisma.storeBusinessHour.findMany({
      where: { merchant_id: merchantId },
      orderBy: { day_of_week: 'asc' }
    })

    // 獲取特殊營業時間（今天開始的未來30天）
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const thirtyDaysLater = new Date(todayStart)
    thirtyDaysLater.setDate(todayStart.getDate() + 30)

    const specialHours = await prisma.storeSpecialHour.findMany({
      where: { 
        merchant_id: merchantId,
        date: {
          gte: todayStart,
          lte: thirtyDaysLater
        }
      },
      orderBy: { date: 'asc' }
    })

    return {
      success: true,
      data: {
        businessHours,
        specialHours
      }
    }

  } catch (error) {
    console.error('Error fetching business hours:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch business hours'
    })
  }
})