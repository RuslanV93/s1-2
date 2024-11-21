// import { db } from '../../../db/db';
// import { BlogType } from '../../../types/db.type';
//
// export const blogsRepository = {
//   async findBlogIndex(id: string) {
//     return db.blogs.findIndex((blog: BlogType) => blog.id === id);
//   },
//   async getBlogs(): Promise<Array<BlogType>> {
//     return db.blogs;
//   },
//   async getBlogById(id: string): Promise<BlogType> {
//     const [blogById] = db.blogs.filter((blog): boolean => blog.id === id);
//     return blogById;
//   },
//   async addNewBlog(newBlog: BlogType): Promise<BlogType | undefined> {
//     db.blogs = [...db.blogs, newBlog];
//     return db.blogs.find((blog) => blog.id === newBlog.id);
//   },
//   async deleteBlogById(id: string) {
//     db.blogs = db.blogs.filter((blog) => blog.id !== id);
//   },
//   async updateBlogById(updatedBlog: BlogType) {
//     const blogIndex = await this.findBlogIndex(updatedBlog.id);
//     db.blogs[blogIndex] = { ...db.blogs[blogIndex], ...updatedBlog };
//   },
// };
