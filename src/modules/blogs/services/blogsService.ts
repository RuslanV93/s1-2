import { blogsRepository } from '../repositories/blogsRepository';
import {
  BlogForUpdateType,
  BlogViewType,
  NewBlogType,
} from '../../../types/db.type';
import {
  blogRequestTypeBody,
  blogRequestTypeWithBodyAndParams,
} from '../types/blogsRequestResponseTypes';
import { WithId } from 'mongodb';
import { Request } from 'express';

export const blogsService = {
  async getBlogs() {
    return await blogsRepository.getBlogs();
  },
  async getBlogById(id: string) {
    return await blogsRepository.getBlogById(id);
  },
  async addNewBlog(
    body: blogRequestTypeBody,
  ): Promise<WithId<BlogViewType> | null> {
    const newBlog: NewBlogType = {
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return await blogsRepository.addNewBlog(newBlog);
  },
  async updateBlog(req: Request<blogRequestTypeWithBodyAndParams>) {
    const updatedBlog: BlogForUpdateType = {
      id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    };
    return await blogsRepository.updateBlogById(updatedBlog);
  },
  async deleteBlogById(id: string): Promise<boolean> {
    return await blogsRepository.deleteBlogById(id);
  },
};
