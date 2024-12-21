import type { AddressItem, AddressParams } from '@/types/address';
import { del, get, post, put } from '@/utils/request';

export const getUserAddress = () =>
  get<AddressItem[]>('/member/address');

export const getUserAddressById = (id: string) =>
  get<AddressItem>(`/member/address/${id}`);

export const addUserAddress = (data: AddressParams) =>
  post('/member/address', { data });

export const updateUserAddressById = (id: string, data: AddressParams) =>
  put(`/member/address/${id}`, { data });

export const deleteUserAddressById = (id: string) =>
  del(`/member/address/${id}`);
