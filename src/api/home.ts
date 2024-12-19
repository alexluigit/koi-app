import type { PageParams, PageResult } from '@/types/global';
import type { BannerItem, CategoryItem, GuessItem, HotItem } from '@/types/home';
import { mockCategoryItems } from '@/api/mocks';
import { get } from '@/utils/request';

/**
 * 首页-广告区域-小程序
 * @param distributionSite 广告区域展示位置（投放位置 投放位置，1为首页，2为分类商品页） 默认是1
 */
export const getHomeBannerAPI = (distributionSite = 1) => {
  return get<BannerItem[]>('/home/banner', {
    data: { distributionSite },
  });
};

/**
 * 首页-前台分类-小程序
 */
export const getHomeCategoryAPI = () => {
  return new Promise<CategoryItem[]>((resolve, _) => {
    setTimeout(() => resolve(mockCategoryItems), 100);
  });
};
// export const getHomeCategoryAPI = () =>
//   get<CategoryItem[]>('/home/category/mutli');

/**
 * 首页-热门推荐-小程序
 */
export const getHomeHotAPI = () =>
  get<HotItem[]>('/home/hot/mutli');

/**
 * 猜你喜欢-小程序
 */
export const getHomeGuessLikeAPI = (data?: PageParams) =>
  get<PageResult<GuessItem>>('/home/goods/guessLike', { data });
