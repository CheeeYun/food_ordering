// server/api/test-db.get.ts
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // 測試資料庫連線
    const merchantCount = await prisma.merchant.count();
    const productCount = await prisma.products.count();

    return {
      status: 'success',
      data: {
        merchantCount,
        productCount,
        message: 'Database connection successful',
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database connection failed',
    });
  }
});
