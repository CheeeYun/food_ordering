import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { merchantId, is_active, manual_override } = body

    // 如果有 merchantId，表示是從客戶端調用的（登入頁面）
    if (merchantId) {
      const updateData: any = { is_active: is_active }
      
      // 如果指定了手動控制，也更新該欄位
      if (manual_override !== undefined) {
        updateData.manual_override_until_midnight = manual_override ? 1 : 0
      }
      
      await prisma.merchant.update({
        where: { lineId: merchantId },
        data: updateData
      })
    } else {
      // 從商家後台調用的，使用 JWT 驗證
      const token = getCookie(event, 'auth-token')
      
      if (!token) {
        throw createError({
          statusCode: 401,
          statusMessage: 'No token provided'
        })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      const merchantDbId = decoded.merchantId

      const updateData: any = { is_active: is_active }
      
      // 如果指定了手動控制，也更新該欄位
      if (manual_override !== undefined) {
        updateData.manual_override_until_midnight = manual_override ? 1 : 0
      }

      await prisma.merchant.update({
        where: { id: merchantDbId },
        data: updateData
      })
    }

    return {
      success: true,
      message: 'Merchant active status updated successfully'
    }
  } catch (error) {
    console.error('Error updating merchant active status:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update merchant active status'
    })
  }
})