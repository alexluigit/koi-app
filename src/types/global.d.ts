export interface PageResult<T> {
  /** 列表数据 */
  items: T[];
  /** 总条数 */
  counts: number;
  /** 当前页数 */
  page: number;
  /** 总页数 */
  pages: number;
  /** 每页条数 */
  pageSize: number;
}

export interface PageParams {
  /** 页码：默认值为 1 */
  page?: number;
  /** 页大小：默认值为 10 */
  pageSize?: number;
}
