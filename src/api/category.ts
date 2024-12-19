import type { CategoryTopItem } from '@/types/category';
import type { BannerItem } from '@/types/home';
import { get } from '@/utils';

/**
 * Request for all categories - miniprogram
 */
export const getCategoryTopAPI = () =>
  get<CategoryTopItem[]>('/category/top');

/**
 *  Banners in category page - miniprogram
 */
export const getCategoryBannerAPI = (distributionSite = 2) =>
  get<BannerItem[]>('/home/banner', { data: { distributionSite } });
