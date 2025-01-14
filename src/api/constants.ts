export enum OrderState {
  PendingPayment = 1,
  PendingDispatch = 2,
  AwaitingReceipt = 3,
  AwaitingComment = 4,
  Finished = 5,
  Cancelled = 6,
}

export const orderStateList = [
  { id: 0, text: '' },
  { id: 1, text: '待付款' },
  { id: 2, text: '待发货' },
  { id: 3, text: '待收货' },
  { id: 4, text: '待评价' },
  { id: 5, text: '已完成' },
  { id: 6, text: '已取消' },
];
