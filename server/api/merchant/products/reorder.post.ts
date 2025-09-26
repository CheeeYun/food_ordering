import jwt from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  try {
    // 驗證 JWT token
    const token = getCookie(event, 'auth-token');
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      });
    }

    const decoded: any = jwt.verify(token, config.jwtSecret);
    const merchantId = decoded.id;

    // 驗證必填欄位
    if (!body.updates || !Array.isArray(body.updates)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Updates array is required',
      });
    }

    console.log('Reordering products for merchant:', merchantId);
    console.log('Updates:', body.updates);

    // 批量更新商品排序
    const updatePromises = body.updates.map((update: any) =>
      prisma.product.updateMany({
        where: {
          id: update.id,
          merchant_id: merchantId, // 確保只能更新自己的商品
        },
        data: {
          sort_order: update.sort_order,
        },
      })
    );

    await Promise.all(updatePromises);

    console.log('Product reordering completed successfully');

    return {
      success: true,
      message: 'Products reordered successfully',
    };
  } catch (error) {
    console.error('Failed to reorder products:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to reorder products',
    });
  }
});
