import jwt from 'jsonwebtoken'
import { getMerchantBusinessStatus } from '../../utils/businessHours'

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

    const status = await getMerchantBusinessStatus(merchantId)

    return {
      success: true,
      data: status
    }

  } catch (error) {
    console.error('Error getting business status:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get business status'
    })
  }
})