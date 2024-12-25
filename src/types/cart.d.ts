export interface CartItem {
  id: string;
  skuId: string;
  name: string;
  picture: string;
  count: number;
  price: number; // 加入时价格
  nowPrice: number; // 当前的价格
  stock: number;
  selected: boolean;
  attrsText: string;
  isEffective: boolean;
}
