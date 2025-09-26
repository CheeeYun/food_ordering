import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { 
      merchantId, 
      orderId, 
      amount, 
      productName, 
      redirectUrls 
    } = body;

    if (!merchantId || !orderId || !amount || !productName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameters',
      });
    }

    // 獲取商家的 LINE Pay 設定 - 使用 lineId (傳入的是 LINE User ID)
    const merchant = await prisma.merchant.findUnique({
      where: { lineId: merchantId },
      select: {
        id: true,
        linePay_channel_id: true,
        linePay_secret_key: true,
        store_name: true,
      }
    });

    console.log('Found merchant:', merchant ? 'Yes' : 'No');
    console.log('Merchant LINE ID searched:', merchantId);
    if (merchant) {
      console.log('Merchant database ID:', merchant.id);
      console.log('Has LINE Pay config:', !!(merchant.linePay_channel_id && merchant.linePay_secret_key));
    }

    if (!merchant || !merchant.linePay_channel_id || !merchant.linePay_secret_key) {
      throw createError({
        statusCode: 400,
        statusMessage: 'LINE Pay not configured for this merchant',
      });
    }

    // 準備 LINE Pay API 請求
    const requestId = crypto.randomUUID();
    const requestBody = {
      amount: parseInt(amount),
      currency: 'TWD',
      orderId: orderId,
      packages: [
        {
          id: 'package-1',
          amount: parseInt(amount),
          name: merchant.store_name || 'ThankQ 訂單',
          products: [
            {
              name: productName,
              quantity: 1,
              price: parseInt(amount),
            }
          ]
        }
      ],
      redirectUrls: redirectUrls || {
        confirmUrl: `${getRequestURL(event).origin}/payment/linepay/confirm`,
        cancelUrl: `${getRequestURL(event).origin}/payment/linepay/cancel`,
      },
    };

    // 生成 HMAC 簽名
    const channelSecret = merchant.linePay_secret_key;
    const nonce = crypto.randomUUID();
    const timestamp = Date.now().toString();
    
    console.log('Debug LINE Pay request:');
    console.log('Channel ID:', merchant.linePay_channel_id);
    console.log('Channel Secret length:', channelSecret?.length);
    console.log('Nonce:', nonce);
    console.log('Timestamp:', timestamp);
    
    // 確保 JSON 字符串是緊湊格式，沒有額外的空格
    const bodyString = JSON.stringify(requestBody);
    console.log('Request body:', bodyString);
    
    const signature = generateSignature(channelSecret, '/v3/payments/request', bodyString, nonce);
    console.log('Generated signature:', signature);

    // 發送請求到 LINE Pay API
    console.log('Request headers:');
    console.log('X-LINE-ChannelId:', merchant.linePay_channel_id);
    console.log('X-LINE-Authorization-Nonce:', nonce);
    console.log('X-LINE-Authorization-TimeStamp:', timestamp);
    console.log('X-LINE-Authorization:', signature);
    
    const response = await $fetch('https://api-pay.line.me/v3/payments/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': merchant.linePay_channel_id,
        'X-LINE-Authorization-Nonce': nonce,
        'X-LINE-Authorization-TimeStamp': timestamp,
        'X-LINE-Authorization': signature,
      },
      body: bodyString, // 使用字符串而非對象
    });

    if (response.returnCode === '0000') {
      return {
        success: true,
        data: {
          transactionId: response.info.transactionId,
          paymentUrl: response.info.paymentUrl.web,
          orderId: orderId,
        }
      };
    } else {
      console.log('LINE Pay API Error Response:', response);
      throw createError({
        statusCode: 400,
        statusMessage: `LINE Pay API Error: ${response.returnMessage || 'Unknown error'}`,
      });
    }

  } catch (error) {
    console.error('LINE Pay request error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Payment request failed',
    });
  }
});

// 生成 LINE Pay HMAC 簽名
function generateSignature(channelSecret: string, uri: string, body: string, nonce: string): string {
  // LINE Pay API 簽名格式: ChannelSecret + URI + RequestBody + Nonce (不包含 timestamp)
  const message = channelSecret + uri + body + nonce;
  console.log('Signature components:');
  console.log('- ChannelSecret length:', channelSecret.length);
  console.log('- URI:', uri);
  console.log('- Body:', body);
  console.log('- Nonce:', nonce);
  console.log('- Full message:', message);
  
  const signature = crypto.createHmac('sha256', channelSecret).update(message, 'utf8').digest('base64');
  console.log('Generated signature:', signature);
  return signature;
}