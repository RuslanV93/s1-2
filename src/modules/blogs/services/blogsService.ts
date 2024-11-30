import { blogsRepository } from '../repositories/blogsRepository';
import {
  BlogDbType,
  BlogForUpdateType,
  BlogViewType,
  NewBlogType,
  NewPostType,
  PostViewType,
} from '../../../types/db.type';
import {
  blogRequestTypeBody,
  blogRequestTypeWithBodyAndParams,
  postByBlogRequestTypeBody,
} from '../types/blogsRequestResponseTypes';
import { ObjectId } from 'mongodb';
import { Request } from 'express';
import { responseArrayWithId } from '../../../helpers/responseArrayWithId';

export const blogsService = {
  async addNewPostToBlog(
    body: postByBlogRequestTypeBody,
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
  async addNewBlog(body: blogRequestTypeBody): Promise<ObjectId | null> {
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
