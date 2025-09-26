// server/api/merchant/products.post.ts
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

    // 取得表單資料
    const body = await readBody(event);
    const {
      id,
      name,
      description,
      price,
      sale_price,
      image_url,
      category,
      is_active = true,
      sort_order = 0,
      note,
      optionGroups = [],
    } = body;

    // 驗證必填欄位
    if (!name?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product name is required',
      });
    }

    if (!price || price <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid price is required',
      });
    }

    console.log('Creating product for merchant ID:', decoded.merchantId);
    console.log('Full request body:', JSON.stringify(body, null, 2));
    console.log('optionGroups:', optionGroups);

    const productData = {
      merchant_id: decoded.merchantId,
      name: name.trim(),
      description: description?.trim() || null,
      price: parseFloat(price),
      sale_price: sale_price ? parseFloat(sale_price) : null,
      image_url: image_url?.trim() || null,
      category: category?.trim() || null,
      is_active: Boolean(is_active),
      sort_order: parseInt(sort_order) || 0,
      note: note?.trim() || null,
    };

    // 只處理新增商品（這個檔案專門負責新增）
    const product = await prisma.product.create({
      data: productData,
    });

    console.log('Product created:', product);

    // 處理選項群組
    if (optionGroups && optionGroups.length > 0) {
      console.log('Creating option groups:', optionGroups);
      
      for (let groupIndex = 0; groupIndex < optionGroups.length; groupIndex++) {
        const group = optionGroups[groupIndex];
        
        if (!group.name || group.name.trim() === '') continue;
        
        // 創建選項群組
        const optionGroup = await prisma.productOptionGroup.create({
          data: {
            product_id: product.id,
            name: group.name.trim(),
            selection_type: group.selection_type || 'single',
            is_required: Boolean(group.is_required),
            sort_order: groupIndex,
          },
        });
        
        console.log('Option group created:', optionGroup);
        
        // 創建群組中的選項
        if (group.options && group.options.length > 0) {
          const optionsData = group.options
            .filter((option: any) => option.name && option.name.trim() !== '')
            .map((option: any, optionIndex: number) => ({
              product_id: product.id,
              group_id: optionGroup.id,
              name: option.name.trim(),
              price: parseFloat(option.price || 0),
              is_active: true,
              sort_order: optionIndex,
            }));
          
          if (optionsData.length > 0) {
            await prisma.productOption.createMany({
              data: optionsData,
            });
            console.log(`Created ${optionsData.length} options for group ${optionGroup.name}`);
          }
        }
      }
    }

    // 取得完整的商品資料（包含選項群組和選項）
    const fullProduct = await prisma.product.findUnique({
      where: {id: product.id},
      include: {
        optionGroups: {
          include: {
            options: {
              where: {is_active: true},
              orderBy: {sort_order: 'asc'},
            },
          },
          orderBy: {sort_order: 'asc'},
        },
        options: {
          where: {is_active: true, group_id: null},
          orderBy: {sort_order: 'asc'},
        },
      },
    });

    console.log('新增商品完成:', fullProduct);

    return {success: true, data: fullProduct};
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token',
      });
    }

    console.error('Product save error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to save product',
    });
  }
});
