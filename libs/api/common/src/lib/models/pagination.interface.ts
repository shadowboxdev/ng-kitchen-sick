type PaginationOptions = 'currentPage' | 'totalPages' | 'perPage' | 'total';

export interface Pagination<T> {
  data: T[];
  pagination?: Record<PaginationOptions, number> | undefined;
}
