import { db } from '../../../db/db';
import { BlogType } from '../../../types/db.type';

export const blogsRepository = {
  findBlogIndex(id: string) {
    return db.blogs.findIndex((blog: BlogType) => blog.id === id);
  },
  getBlogs(): Array<BlogType> {
    return db.blogs;
  },
  getBlogById(id: string): BlogType {
    const [blogById] = db.blogs.filter((blog): boolean => blog.id === id);
    return blogById;
  },
  addNewBlog(newBlog: BlogType) {
    db.blogs = [...db.blogs, newBlog];
    return db.blogs.find((blog) => blog.id === newBlog.id);
  },
  deleteBlogById(id: string) {
    db.blogs = db.blogs.filter((blog) => blog.id !== id);
  },
  updateBlogById(updatedBlog: BlogType) {
    const blogIndex = this.findBlogIndex(updatedBlog.id);
    db.blogs[blogIndex] = { ...db.blogs[blogIndex], ...updatedBlog };
  },
};
