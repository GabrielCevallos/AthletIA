export interface PaginationResponse<T> {
  items: T[];
  total: number;
  limit?: number;
  offset?: number;
}
