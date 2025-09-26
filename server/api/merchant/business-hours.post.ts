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
    
    const body = await readBody(event)
    const { businessHours, specialHours } = body

    // 使用事務處理
    await prisma.$transaction(async (tx) => {
      // 更新或創建一般營業時間
      if (businessHours && Array.isArray(businessHours)) {
        for (const hour of businessHours) {
          await tx.storeBusinessHour.upsert({
            where: {
              merchant_id_day_of_week: {
                merchant_id: merchantId,
                day_of_week: hour.day_of_week
              }
            },
            create: {
              merchant_id: merchantId,
              day_of_week: hour.day_of_week,
              is_open: hour.is_open,
              open_time: hour.open_time,
              close_time: hour.close_time,
              break_start_time: hour.break_start_time,
              break_end_time: hour.break_end_time
            },
            update: {
              is_open: hour.is_open,
              open_time: hour.open_time,
              close_time: hour.close_time,
              break_start_time: hour.break_start_time,
              break_end_time: hour.break_end_time
            }
          })
        }
      }

      // 處理特殊營業時間
      if (specialHours && Array.isArray(specialHours)) {
        for (const special of specialHours) {
          if (special.id) {
            // 更新現有記錄
            await tx.storeSpecialHour.update({
              where: { id: special.id },
              data: {
                is_open: special.is_open,
                open_time: special.open_time,
                close_time: special.close_time,
                reason: special.reason
              }
            })
          } else {
            // 創建新記錄
            await tx.storeSpecialHour.upsert({
              where: {
                merchant_id_date: {
                  merchant_id: merchantId,
                  date: new Date(special.date)
                }
              },
              create: {
                merchant_id: merchantId,
                date: new Date(special.date),
                is_open: special.is_open,
                open_time: special.open_time,
                close_time: special.close_time,
                reason: special.reason
              },
              update: {
                is_open: special.is_open,
                open_time: special.open_time,
                close_time: special.close_time,
                reason: special.reason
              }
            })
          }
        }
      }
    })

    return {
      success: true,
      message: '營業時間設定已更新'
    }

  } catch (error) {
    console.error('Error updating business hours:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update business hours'
    })
  }
})