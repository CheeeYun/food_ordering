import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  try {
    const body = await readBody(event);
    const { username, password } = body;

    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username and password are required',
      });
    }

    // 查找商家
    const merchant = await prisma.merchant.findUnique({
      where: { username: username.trim() },
      select: {
        id: true,
        username: true,
        password_hash: true,
        store_name: true,
        is_active: true,
      }
    });

    if (!merchant) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      });
    }

    // 檢查商家是否啟用
    if (!merchant.is_active) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Account is disabled',
      });
    }

    // 檢查密碼
    if (!merchant.password_hash) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Password not set for this account',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, merchant.password_hash);
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { 
        merchantId: merchant.id,
        username: merchant.username,
        type: 'credential_login'
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return {
      success: true,
      data: {
        success: true,
        token,
        merchant: {
          id: merchant.id,
          username: merchant.username,
          store_name: merchant.store_name,
        }
      }
    };
  } catch (error: any) {
    console.error('Login failed:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Login failed',
    });
  }
});