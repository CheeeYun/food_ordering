import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { username } = body;

    if (!username) {
      return {
        available: false,
        message: 'Username is required'
      };
    }

    // 檢查帳號是否已存在
    const existingMerchant = await prisma.merchant.findUnique({
      where: { username: username.trim() }
    });

    return {
      available: !existingMerchant,
      message: existingMerchant ? '此帳號已被使用' : '帳號可以使用'
    };
  } catch (error) {
    console.error('Check username error:', error);
    return {
      available: false,
      message: '檢查失敗，請稍後再試'
    };
  }
});