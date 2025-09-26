import { getMerchantBusinessStatus, getNextBusinessHour } from '../../../utils/businessHours';

export default defineEventHandler(async (event) => {
  try {
    const merchantId = parseInt(getRouterParam(event, 'merchantId') as string);
    
    if (!merchantId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid merchant ID'
      });
    }

    const businessStatus = await getMerchantBusinessStatus(merchantId);
    const nextBusinessHour = businessStatus.finalStatus ? null : await getNextBusinessHour(merchantId);

    return {
      success: true,
      data: {
        ...businessStatus,
        nextBusinessHour
      }
    };

  } catch (error) {
    console.error('Error getting business status:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get business status'
    });
  }
});