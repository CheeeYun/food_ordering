// server/api/merchant/products.get.ts
import jwt from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // 從 cookie 取得 JWT token
  const authToken = getCookie(event, 'auth-token');

  if (!authToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  try {
    // 驗證 JWT token
    const decoded = jwt.verify(authToken, config.jwtSecret) as any;

    // 取得商家的所有商品
    const products = await prisma.product.findMany({
      where: {merchant_id: decoded.merchantId},
      orderBy: [{sort_order: 'asc'}, {created_at: 'desc'}],
      include: {
        optionGroups: {
          include: {
            options: {
              orderBy: {sort_order: 'asc'},
            },
          },
          orderBy: {sort_order: 'asc'},
        },
        options: {
          where: {group_id: null},
          orderBy: {sort_order: 'asc'},
        },
      },
    });

    // 按分類整理商品
    const productsByCategory = products.reduce((acc, product) => {
      const category = product.category || '未分類';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, typeof products>);

    return {
      products,
      productsByCategory,
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.is_active).length,
      categories: Object.keys(productsByCategory),
    };
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token',
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products',
    });
  }
});
