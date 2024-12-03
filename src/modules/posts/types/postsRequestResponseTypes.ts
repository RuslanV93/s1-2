export type PostRequestTypeWithParams = {
  id: string;
};
export type PostRequestTypeWithBody = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
};
export type PostRequestTypeQuery = {
  pageNumber: number;
  pageSize: number;
  sortBy: any;
  sortDirection: string;
  search: any;
};
export type PostRequestTypeWithBodyAndParams = PostRequestTypeWithParams &
  PostRequestTypeWithBody;

export type PostRequestTypeWithBodyAndParamsAndQuery = PostRequestTypeWithParams &
  PostRequestTypeWithBody &
  PostRequestTypeQuery;
