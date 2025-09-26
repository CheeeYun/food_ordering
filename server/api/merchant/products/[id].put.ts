import jwt from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const productId = getRouterParam(event, 'id');
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
    const merchantId = parseInt(decoded.id) || decoded.id;

    console.log(
      'PUT - decoded.id:',
      decoded.id,
      'merchantId:',
      merchantId,
      'type:',
      typeof merchantId
    );
    console.log('Updating product for merchant ID:', merchantId);

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

    // 驗證必填欄位
    if (!body.name || !body.price) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product name and price are required',
      });
    }

    // 更新商品資料
    const productData = {
      name: body.name,
      description: body.description || null,
      price: parseFloat(body.price),
      sale_price: body.sale_price ? parseFloat(body.sale_price) : null,
      image_url: body.image_url || null,
      category: body.category || null,
      is_active: body.is_active !== false,
    };

    const updatedProduct = await prisma.product.update({
      where: {id: parseInt(productId)},
      data: productData,
    });

    // 處理選項群組和選項更新
    if (body.optionGroups !== undefined || body.options !== undefined) {
      // 刪除現有的選項群組和選項
      await prisma.productOptionGroup.deleteMany({
        where: {product_id: parseInt(productId)},
      });

      // 刪除沒有群組的選項
      await prisma.productOption.deleteMany({
        where: {product_id: parseInt(productId), group_id: null},
      });

      // 創建新的選項群組
      if (body.optionGroups && body.optionGroups.length > 0) {
        for (
          let groupIndex = 0;
          groupIndex < body.optionGroups.length;
          groupIndex++
        ) {
          const group = body.optionGroups[groupIndex];

          if (!group.name || group.name.trim() === '') continue;

          // 創建選項群組
          const optionGroup = await prisma.productOptionGroup.create({
            data: {
              product_id: parseInt(productId),
              name: group.name.trim(),
              selection_type: group.selection_type || 'single',
              is_required: Boolean(group.is_required),
              sort_order: groupIndex,
            },
          });

          // 創建群組中的選項
          if (group.options && group.options.length > 0) {
            const optionsData = group.options
              .filter((option: any) => option.name && option.name.trim() !== '')
              .map((option: any, optionIndex: number) => ({
                product_id: parseInt(productId),
                group_id: optionGroup.id,
                name: option.name.trim(),
                price: parseFloat(option.price || 0),
                is_active: option.is_active !== undefined ? option.is_active : true,
                sort_order: optionIndex,
              }));

            if (optionsData.length > 0) {
              await prisma.productOption.createMany({
                data: optionsData,
              });
            }
          }
        }
      }

      // 向後相容：處理沒有群組的舊式選項
      if (body.options && body.options.length > 0) {
        const optionsData = body.options
          .filter((option: any) => option.name && option.name.trim() !== '')
          .map((option: any, index: number) => ({
            product_id: parseInt(productId),
            group_id: null,
            name: option.name.trim(),
            price: parseFloat(option.price || 0),
            is_active: option.is_active !== undefined ? option.is_active : true,
            sort_order: index,
          }));

        if (optionsData.length > 0) {
          await prisma.productOption.createMany({
            data: optionsData,
          });
        }
      }
    }

    // 取得完整的商品資料（包含選項群組和選項）
    const fullProduct = await prisma.product.findUnique({
      where: {id: parseInt(productId)},
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

    return {
      success: true,
      data: fullProduct,
    };
  } catch (error) {
    console.error('Failed to update product:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update product',
    });
  }
});
