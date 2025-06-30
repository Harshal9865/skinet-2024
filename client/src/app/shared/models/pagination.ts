// src/app/shared/models/pagination.ts
export type Pagination<T> = {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
};
