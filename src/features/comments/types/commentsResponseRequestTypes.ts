export type CommentsRequestWithQueryType = {
  pageNumber: number;
  pageSize: number;
  sortBy: any;
  sortDirection: string;
  search: any;
};

export type CommentsRequestWithBodyType = {
  content: string;
};

export type CommentsRequestWithParamsType = { id: string };
