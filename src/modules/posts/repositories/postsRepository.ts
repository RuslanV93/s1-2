import { db } from '../../../db/db';
import { NewPostType, PostType } from '../../../types/db.type';

export const postsRepository = {
  findPostIndex(id: string) {
    return db.posts.findIndex((post) => post.id === id);
  },

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
  deletePostById(id: string) {
    db.posts = db.posts.filter((post) => post.id !== id);
  },
  updatePostById(id: string, updatedPost: PostType) {
    const postIndex = this.findPostIndex(id);
    db.posts[postIndex] = { ...db.posts[postIndex], ...updatedPost };
  },
};
