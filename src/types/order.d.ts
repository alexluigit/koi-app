import type { OrderState } from '@/api/constants';
import type { PageParams } from '@/types/global';
import type { AddressItem } from './address';

export interface BillingInfo {
  goods: BillingItems[];
  summary: {
    totalPrice: number;
    postFee: number;
    totalPayPrice: number;
  };
  userAddresses: AddressItem[];
}

export interface BillingItems {
  skuId: string;
  attrsText: string; /** 属性文字，例如“颜色:瓷白色 尺寸：8寸” */
  count: number;
  id: string;
  name: string;
  picture: string;
  payPrice: string; /** 实付单价 */
  price: string; /** 原单价 */
  totalPayPrice: string; /** 实付价格小计 */
  totalPrice: string; /** 小计总价 */
}

export interface NewOrderParams {
  addressId: string;
  deliveryTimeType: number; /** 配送时间类型，1为不限，2为工作日，3为双休或假日 */
  buyerMessage: string; /** 订单备注 */
  goods: {
    count: number;
    skuId: string;
  }[];
  /** 支付渠道：支付渠道，1支付宝、2微信--支付方式为在线支付时，传值，为货到付款时，不传值 */
  payChannel: 1 | 2;
  /** 支付方式，1为在线支付，2为货到付款 */
  payType: 1 | 2;
}

export interface OrderCreateResponse {
  id: string;
}

export interface OrderDetails {
  id: string;
  /** 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消 */
  orderState: OrderState;
  /** 倒计时--剩余的秒数 -1 表示已经超时，正数表示倒计时未结束 */
  countdown: number;
  skus: OrderSkuItem[];
  receiverContact: string;
  receiverMobile: string;
  receiverAddress: string;
  createTime: string;
  totalMoney: number;
  postFee: number;
  payMoney: number;
}

export interface OrderSkuItem {
  id: string;
  spuId: string;
  name: string;
  attrsText: string;
  quantity: number;
  curPrice: number; /** 购买时单价 */
  image: string;
}

export interface OrderDeliveryResponse {
  company: {
    name: string;
    number: string;
    tel: string;
  };
  count: number;
  list: DeliveryLog[];
}

export interface DeliveryLog {
  id: string;
  text: string;
  time: string;
}

export type OrderListParams = PageParams & { orderState: number };

export interface OrderListResponse {
  counts: number;
  items: OrderItem[];
  page: number;
  pages: number;
  pageSize: number;
}

export type OrderItem = OrderDetails & {
  totalNum: number;
};
