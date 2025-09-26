import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { merchantId, customerAddress } = body;

    if (!merchantId || !customerAddress) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameters',
      });
    }

    // 取得商家資訊和地址
    const merchant = await prisma.merchant.findUnique({
      where: { lineId: merchantId },
      select: {
        address: true,
        store_name: true,
      },
    });

    if (!merchant) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Merchant not found',
      });
    }

    if (!merchant.address) {
      return {
        success: false,
        error: '店家尚未設定地址，無法計算距離',
      };
    }

    // 調用您的距離計算API
    const distance = await calculateDistanceBetweenAddresses(
      merchant.address,
      customerAddress
    );

    return {
      success: true,
      distance: distance,
      merchantAddress: merchant.address,
      customerAddress: customerAddress,
    };
  } catch (error) {
    console.error('Calculate distance error:', error);
    
    if (error.message) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to calculate distance',
    });
  }
});

// 使用您的API計算距離
async function calculateDistanceBetweenAddresses(
  merchantAddress: string,
  customerAddress: string
): Promise<number> {
  try {
    const apiUrl = 'https://n8n.cheeyun.us.kg/webhook/8751dc26-4bfa-4565-8583-d7ffd62c649e';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_address: customerAddress,
        store_address: merchantAddress,
      }),
    });

    if (!response.ok) {
      throw new Error(`API請求失敗: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 'Ok' && data.distance) {
      // 將距離從公尺轉換為公里，保留一位小數
      const distanceInKm = Math.round(parseFloat(data.distance) / 100) / 10;
      
      console.log(`距離計算成功: ${merchantAddress} -> ${customerAddress} = ${distanceInKm}km`);
      
      return distanceInKm;
    } else {
      throw new Error('API返回異常數據');
    }
  } catch (error) {
    console.error('Distance calculation error:', error);
    throw new Error('無法計算距離，請檢查地址是否正確');
  }
}