import { db } from '../../../db/db';
import { PostType } from '../../../types/db.type';
import { NewPostType } from '../types/postsRequestResponseTypes';

export const postsRepository = {
  findPostIndex(id: string) {
    return db.posts.findIndex((post) => post.id === id);
  },
  getBlogNameById(id: string) {
    const [blog] = db.blogs.filter((blog) => blog.id === id);
    console.log(blog);
    return blog.name;
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
  updatePostById(updatedPost: PostType) {
    const postIndex = this.findPostIndex(updatedPost.id);
    db.posts[postIndex] = { ...db.posts[postIndex], ...updatedPost };
  },
};
