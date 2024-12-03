import { blogsRepository } from '../repositories/blogsRepository';
import {
  BlogRequestTypeBody,
  BlogRequestTypeWithBodyAndParams,
  PostByBlogRequestTypeBody,
} from '../types/blogsRequestResponseTypes';
import { ObjectId } from 'mongodb';
import { Request } from 'express';
import {
  BlogDbType,
  BlogForUpdateType,
  BlogViewType,
  NewBlogType,
} from '../types/blogsTypes';
import { NewPostType, PostViewType } from '../../posts/types/postsTypes';

export const blogsService = {
  async addNewPostToBlog(
    body: PostByBlogRequestTypeBody,
    blogToAddPost: BlogViewType,
  ): Promise<ObjectId | null> {
    const newPost: NewPostType = {
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: new ObjectId(blogToAddPost.id),
      blogName: blogToAddPost.name,
      createdAt: new Date().toISOString(),
    };
    return await blogsRepository.addNewPostToBlog(newPost);
  },
  async addNewBlog(body: BlogRequestTypeBody): Promise<ObjectId | null> {
    const newBlog: NewBlogType = {
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return await blogsRepository.addNewBlog(newBlog);
  },
  async updateBlog(req: Request<BlogRequestTypeWithBodyAndParams>) {
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
