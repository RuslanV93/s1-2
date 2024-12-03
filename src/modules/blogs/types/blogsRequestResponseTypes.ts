export type BlogRequestTypeParams = {
  id: string;
};
export type BlogRequestTypeBody = {
  name: string;
  description: string;
  websiteUrl: string;
};
export type BlogRequestTypeQuery = {
  pageNumber: number;
  pageSize: number;
  sortBy: any;
  sortDirection: string;
  search: any;
};

export type PostByBlogRequestTypeBody = {
  title: string;
  shortDescription: string;
  content: string;
};
export type BlogRequestTypeWithBodyAndParams = BlogRequestTypeParams &
  BlogRequestTypeBody;

export type BlogRequestTypeWithBodyAndParamsAndQuery = BlogRequestTypeParams &
  BlogRequestTypeBody &
  BlogRequestTypeQuery;
