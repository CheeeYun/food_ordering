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
    
    const specialHourId = getRouterParam(event, 'id')
    
    if (!specialHourId || isNaN(Number(specialHourId))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid special hour ID'
      })
    }

    // 驗證這個特殊時間是否屬於當前商家
    const specialHour = await prisma.storeSpecialHour.findUnique({
      where: {
        id: parseInt(specialHourId)
      }
    })

    if (!specialHour) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Special hour not found'
      })
    }

    if (specialHour.merchant_id !== merchantId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Not authorized to delete this special hour'
      })
    }

    // 刪除特殊時間
    await prisma.storeSpecialHour.delete({
      where: {
        id: parseInt(specialHourId)
      }
    })

    return {
      success: true,
      message: 'Special hour deleted successfully'
    }

  } catch (error) {
    console.error('Error deleting special hour:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete special hour'
    })
  }
})