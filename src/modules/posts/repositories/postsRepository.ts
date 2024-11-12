import { db } from '../../../db/db';
import { PostType } from '../../../types/db.type';

export type NewPostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
};

export const postsRepository = {
  getPosts: (): Array<PostType> => {
    return db.posts;
  },
  getPostById: (id: string): PostType => {
    console.log(id);
    const [post] = db.posts.filter((post) => post.id === id);
    return post;
  },
  addNewPost: (newPost: NewPostType): PostType | undefined => {
    db.posts = [...db.posts, newPost];
    return db.posts.find((post) => post.id === newPost.id);
  },
};
