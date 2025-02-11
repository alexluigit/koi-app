import { get } from '@/utils/request';

export type cardInfoRes = {
  id: number;
  pin: string;
  password: string;
  type: number;
  balance: number;
  created_at: string;
};

export const getCardInfo = (cardPin: string) =>
  get<cardInfoRes>(`/user/gift-card/info?account=admin&giftCardPin=${cardPin}`, { baseURL: 'https://api.jinlifuli.cn' });
