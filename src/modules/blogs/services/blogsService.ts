import { blogsRepository } from '../repositories/blogsRepository';
import {
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
import { WithId } from 'mongodb';
import { Request } from 'express';
import { responseArrayWithId } from '../../../helpers/responseArrayWithId';

export const blogsService = {
  async getBlogs(paginationParams: any) {
    const totalCount =
      await blogsRepository.getBlogsTotalCount(paginationParams);
    const blogsFromDb = await blogsRepository.getBlogs(paginationParams);
    return {
      pagesCount: Math.ceil(totalCount / paginationParams.pageSize),
      page: paginationParams.pageNumber,
      pageSize: paginationParams.pageSize,
      totalCount: totalCount,
      items: responseArrayWithId(blogsFromDb),
    };
  },
  async getBlogById(id: string) {
    return await blogsRepository.getBlogById(id);
  },
  async getPostsByBlogId(id: string, paginationParams: any) {
    const totalCount = await blogsRepository.getBlogsPostsCount(id);
    const postsFromDb = await blogsRepository.getPostsByBlogId(
      id,
      paginationParams,
    );
    return {
      pagesCount: Math.ceil(totalCount / paginationParams.pageSize),
      page: paginationParams.pageNumber,
      pageSize: paginationParams.pageSize,
      totalCount: totalCount,
      items: responseArrayWithId(postsFromDb),
    };
  },
  async addNewPostToBlog(
    body: postByBlogRequestTypeBody,
    blogId: string,
  ): Promise<WithId<PostViewType> | null> {
    const blog = await blogsRepository.getBlogById(blogId);
    if (!blog) {
      return null;
    }
    const newPost: NewPostType = {
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    return await blogsRepository.addNewPostToBlog(newPost);
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
