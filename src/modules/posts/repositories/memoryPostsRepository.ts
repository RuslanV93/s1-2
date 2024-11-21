// import { db } from '../../../db/db';
// import { PostType } from '../../../types/db.type';
// import { NewPostType } from '../types/postsRequestResponseTypes';
//
// export const postsRepository = {
//   async findPostIndex(id: string): Promise<number> {
//     return db.posts.findIndex((post) => post.id === id);
//   },
//   async getBlogNameById(id: string) {
//     const [blog] = db.blogs.filter((blog) => blog.id === id);
//
//     return blog.name;
//   },
//
//   async getPosts(): Promise<Array<PostType>> {
//     return db.posts;
//   },
//   async getPostById(id: string): Promise<PostType> {
//     const [post] = db.posts.filter((post) => post.id === id);
//     return post;
//   },
//   async addNewPost(newPost: NewPostType): Promise<PostType | undefined> {
//     db.posts = [...db.posts, newPost];
//
//     return db.posts.find((post) => post.id === newPost.id);
//   },
//   async deletePostById(id: string) {
//     db.posts = db.posts.filter((post) => post.id !== id);
//   },
//   async updatePostById(updatedPost: PostType) {
//     const postIndex = await this.findPostIndex(updatedPost.id);
//     db.posts[postIndex] = { ...db.posts[postIndex], ...updatedPost };
//   },
// };
