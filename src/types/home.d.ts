import type { ProductItem } from '@/types/product';

/** 首页-广告区域数据类型 */
export interface BannerItem {
  /** 跳转链接 */
  hrefUrl: string;
  /** id */
  id: string;
  /** 图片链接 */
  imgUrl: string;
  /** 跳转类型 */
  type: number;
}

/** 首页-前台品类数据类型 */
export interface CategoryItem {
  /** 图标路径 */
  icon: string;
  /** id */
  id: number;
  /** 分类名称 */
  name: string;
}

/** 首页-热门推荐数据类型 */
export interface HotItem {
  /** 说明 */
  alt: string;
  /** id */
  id: string;
  /** 图片集合[ 图片路径 ] */
  pictures: string[];
  /** 跳转地址 */
  target: string;
  /** 标题 */
  title: string;
  /** 推荐类型 */
  type: string;
}

/** 猜你喜欢-商品类型 */
export type GuessItem = ProductItem;
