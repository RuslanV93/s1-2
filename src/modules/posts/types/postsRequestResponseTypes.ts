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
  sortBy: string;
  sortDirection: string;
};
export type postRequestTypeWithBodyAndParams = postRequestTypeWithParams &
  postRequestTypeWithBody;

export type postRequestTypeWithBodyAndParamsAndQuery =
  postRequestTypeWithParams & postRequestTypeWithBody & postRequestTypeQuery;
