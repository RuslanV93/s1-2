// export type DBType = {
//   posts: Array<RequestPostType>;
//   blogs: Array<RequestBlogType>;
// };

export type NewBlogType = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
export type NewPostType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string | null;
  createdAt: string;
};
export type BlogForUpdateType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
};
export type PostForUpdateType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string | null;
};
export type BlogViewType = {
  id?: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
export type PostViewType = {
  id?: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
  createdAt?: string;
};
