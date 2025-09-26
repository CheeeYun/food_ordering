import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { 
      transactionId, 
      orderId, 
      merchantId,
      amount
    } = body;

    if (!transactionId || !orderId || !merchantId || !amount) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameters',
      });
    }

    // 獲取商家的 LINE Pay 設定
    const merchant = await prisma.merchant.findUnique({
      where: { lineId: merchantId },
      select: {
        id: true,
        linePay_channel_id: true,
        linePay_secret_key: true,
        store_name: true,
        line_channel_access_token: true,
      }
    });

    if (!merchant || !merchant.linePay_channel_id || !merchant.linePay_secret_key) {
      throw createError({
        statusCode: 400,
        statusMessage: 'LINE Pay not configured for this merchant',
      });
    }

    // 準備確認付款請求
    const requestBody = {
      amount: parseInt(amount),
      currency: 'TWD',
    };
    
    console.log('Confirm request with amount:', amount);

    // 生成 HMAC 簽名
    const channelSecret = merchant.linePay_secret_key;
    const nonce = crypto.randomUUID();
    const timestamp = Date.now().toString();
    const uri = `/v3/payments/${transactionId}/confirm`;
    const bodyString = JSON.stringify(requestBody);
    const signature = generateSignature(channelSecret, uri, bodyString, nonce);
    
    console.log('LINE Pay confirm request:');
    console.log('Transaction ID:', transactionId);
    console.log('URI:', uri);
    console.log('Request body:', bodyString);

    // 發送確認請求到 LINE Pay API
    const response = await $fetch(`https://api-pay.line.me${uri}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': merchant.linePay_channel_id,
        'X-LINE-Authorization-Nonce': nonce,
        'X-LINE-Authorization-TimeStamp': timestamp,
        'X-LINE-Authorization': signature,
      },
      body: bodyString,
    });

    if (response.returnCode === '0000') {
      // 付款成功，不發送推送訊息，而是在 flex message 中顯示付款狀態
      console.log('LINE Pay payment confirmed successfully');
      console.log('Transaction ID:', response.info.transactionId);
      console.log('Amount:', response.info.payInfo[0].amount);

      return {
        success: true,
        data: {
          transactionId: response.info.transactionId,
          orderId: response.info.orderId,
          amount: response.info.payInfo[0].amount,
          paymentMethod: response.info.payInfo[0].method,
        }
      };
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: `LINE Pay confirm error: ${response.returnMessage}`,
      });
    }

  } catch (error) {
    console.error('LINE Pay confirm error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Payment confirmation failed',
    });
  }
});

// 生成 LINE Pay HMAC 簽名
function generateSignature(channelSecret: string, uri: string, body: string, nonce: string): string {
  // LINE Pay API 簽名格式: ChannelSecret + URI + RequestBody + Nonce (不包含 timestamp)
  const message = channelSecret + uri + body + nonce;
  console.log('Confirm signature components:');
  console.log('- ChannelSecret length:', channelSecret.length);
  console.log('- URI:', uri);
  console.log('- Body:', body);
  console.log('- Nonce:', nonce);
  console.log('- Full message:', message);
  
  const signature = crypto.createHmac('sha256', channelSecret).update(message, 'utf8').digest('base64');
  console.log('Generated confirm signature:', signature);
  return signature;
}

