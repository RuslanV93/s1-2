export type NewPostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
};

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
export type postRequestTypeWithBodyAndParams = postRequestTypeWithParams &
  postRequestTypeWithBody;
