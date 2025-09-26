import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const productId = getRouterParam(event, 'id');
  
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
    console.log('Deleting product for merchant ID:', merchantId);

    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required',
      });
    }

    // 驗證商品是否屬於該商家
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: parseInt(productId),
        merchant_id: merchantId,
      },
    });

    if (!existingProduct) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found',
      });
    }

    // 刪除商品選項（由於設定了 Cascade，會自動刪除）
    await prisma.productOption.deleteMany({
      where: { product_id: parseInt(productId) },
    });

    // 刪除商品
    await prisma.product.delete({
      where: { id: parseInt(productId) },
    });

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete product',
    });
  }
});