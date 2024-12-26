import { get } from '@/utils/request';

/**
 * 获取微信支付参数
 * @param data orderId 订单id
 */
export const goWeixinPayment = (data: { orderId: string }) =>
  get<WechatMiniprogram.RequestPaymentOption>('/pay/wxPay/miniPay', { data });

/**
 * 模拟支付-内测版
 * @param data orderId 订单id
 */
export const goMockPayment = (data: { orderId: string }) =>
  get('/pay/mock', { data });
