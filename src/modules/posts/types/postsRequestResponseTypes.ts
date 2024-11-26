export type postRequestTypeWithParams = {
  id: string;
};
export type postRequestTypeWithBody = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
};
export type postRequestTypeQuery = {
  pageNumber: number;
  pageSize: number;
  sortBy: any;
  sortDirection: string;
  search: any;
};
export type postRequestTypeWithBodyAndParams = postRequestTypeWithParams &
  postRequestTypeWithBody;

export type postRequestTypeWithBodyAndParamsAndQuery =
  postRequestTypeWithParams & postRequestTypeWithBody & postRequestTypeQuery;
