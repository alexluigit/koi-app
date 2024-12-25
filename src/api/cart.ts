import type { CartItem } from '@/types/cart';
import { del, get, post, put } from '@/utils/request';

export const addToCart = (data: { skuId: string; count: number }) =>
  post('/member/cart', { data });

export const getCartItems = () =>
  get<CartItem[]>('/member/cart');

export const deleteCartItems = (data: { ids: string[] }) =>
  del('/member/cart', { data });

export const updateCartItemBySkuId = (
  skuId: string,
  data: { selected?: boolean; count?: number },
) => put(`/member/cart/${skuId}`, { data });

export const updateCartAllSelected = (data: { selected: boolean }) =>
  put('/member/cart/selected', { data });
