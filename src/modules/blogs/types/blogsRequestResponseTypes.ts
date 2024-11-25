import QueryString from 'qs';

export type blogRequestTypeParams = {
  id: string;
};
export type blogRequestTypeBody = {
  name: string;
  description: string;
  websiteUrl: string;
};
export type blogRequestTypeQuery = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
  search: any;
};

export type postByBlogRequestTypeBody = {
  title: string;
  shortDescription: string;
  content: string;
};
export type blogRequestTypeWithBodyAndParams = blogRequestTypeParams &
  blogRequestTypeBody;

export type blogRequestTypeWithBodyAndParamsAndQuery = blogRequestTypeParams &
  blogRequestTypeBody &
  blogRequestTypeQuery;
