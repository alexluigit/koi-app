import type { PageParams, PageResult } from '@/types/global';
import type { BannerItem, CategoryItem, GuessItem, HotItem } from '@/types/home';
import { mockCategoryItems } from '@/api/mocks';
import { get } from '@/utils/request';

export const getHomeBannerAPI = (distributionSite = 1) => {
  return get<BannerItem[]>('/home/banner', {
    data: { distributionSite },
  });
};

export const getHomeCategoryAPI = () => {
  return new Promise<CategoryItem[]>((resolve, _) => {
    setTimeout(() => resolve(mockCategoryItems), 100);
  });
};
// export const getHomeCategoryAPI = () =>
//   get<CategoryItem[]>('/home/category/mutli');

export const getHomeHotAPI = () =>
  get<HotItem[]>('/home/hot/mutli');

export const getHomeGuessLikeAPI = (data?: PageParams) =>
  get<PageResult<GuessItem>>('/home/goods/guessLike', { data });
