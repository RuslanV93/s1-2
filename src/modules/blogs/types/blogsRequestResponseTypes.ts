export type blogRequestTypeParams = {
  id: string;
};
export type blogRequestTypeBody = {
  name: string;
  description: string;
  websiteUrl: string;
};
export type blogRequestTypeWithBodyAndParams = blogRequestTypeParams &
  blogRequestTypeBody;
