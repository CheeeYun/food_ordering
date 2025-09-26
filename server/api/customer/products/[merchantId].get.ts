import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const merchantId = getRouterParam(event, 'merchantId');
    
    if (!merchantId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Merchant ID is required',
      });
    }

    // 先根據 lineId 找到商家
    const merchant = await prisma.merchant.findUnique({
      where: { lineId: merchantId.toString() }
    });

    if (!merchant) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Merchant not found',
      });
    }

    // 取得商家的所有商品（包含缺貨商品）
    const products = await prisma.product.findMany({
      where: { 
        merchant_id: merchant.id
      },
      include: {
        optionGroups: {
          include: {
            options: {
              where: { is_active: true },
              orderBy: { sort_order: 'asc' }
            }
          },
          orderBy: { sort_order: 'asc' }
        },
        options: {
          where: { is_active: true, group_id: null }, // 向後相容舊選項
          orderBy: { sort_order: 'asc' }
        }
      },
      orderBy: [{ sort_order: 'asc' }, { id: 'desc' }]
    });

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error('Failed to get products:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load products',
    });
  }
});