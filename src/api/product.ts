import type { ProductResult } from '@/types/product';
import { get } from '@/utils/request';

/**
 * Product details
 * @param id product's query id
 */
export const getProductByIdAPI = (id: string) =>
  get<ProductResult>('/goods', { data: { id } });
