import type {
  BillingInfo,
  NewOrderParams,
  OrderDeliveryResponse,
  OrderDetails,
  OrderListParams,
  OrderListResponse,
} from '@/types/order';
import { del, get, post, put } from '@/utils/request';

export const getCartBillingInfo = () => get<BillingInfo>('/member/order/pre');

export const getBillingInfo = (data: {
  skuId: string;
  count: string;
  addressId?: string;
}) => get<BillingInfo>('/member/order/pre/now', { data });

export const getRepurchaseBillingInfo = (id: string) =>
  get<BillingInfo>(`/member/order/repurchase/${id}`);

export const createOrder = (data: NewOrderParams) =>
  post<{ id: string }>('/member/order', { data });

export const getOrderDetails = (id: string) =>
  get<OrderDetails>(`/member/order/${id}`);

export const mockShipping = (id: string) =>
  get(`/member/order/consignment/${id}`);

export const ConfirmReceipt = (id: string) =>
  put<OrderDetails>(`/member/order/${id}/receipt`);

export const getOrderDeliveryInfo = (id: string) =>
  get<OrderDeliveryResponse>(`/member/order/${id}/logistics`);

export const deleteOrder = (data: { ids: string[] }) =>
  del(`/member/order`, { data });

export const cancelOrder = (id: string, data: { cancelReason: string }) =>
  put<OrderDetails>(`/member/order/${id}/cancel`, { data });

export const getOrderList = (data: OrderListParams) =>
  get<OrderListResponse>('/member/order', { data });
