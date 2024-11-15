export type DBType = {
  posts: Array<PostType>;
  blogs: Array<BlogType>;
};
export type BlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
};
export type PostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
};

export type NewPostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
};
