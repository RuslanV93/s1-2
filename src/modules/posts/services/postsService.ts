import { postsRepository } from '../repositories/postsRepository';
import { Request } from 'express';
import {
  postRequestTypeWithBody,
  postRequestTypeWithParams,
} from '../types/postsRequestResponseTypes';
import {
  NewPostType,
  PostForUpdateType,
  PostViewType,
} from '../../../types/db.type';
import { WithId } from 'mongodb';
import { responseArrayWithId } from '../../../helpers/responseArrayWithId';

export const postsService = {
  async getPosts(paginationParams: any) {
    const totalCount =
      await postsRepository.getPostsTotalCount(paginationParams);
    const postsFromDb = await postsRepository.getPosts(paginationParams);
    return {
      pagesCount: Math.ceil(totalCount / paginationParams.pageSize),
      page: paginationParams.pageNumber,
      pageSize: paginationParams.pageSize,
      totalCount: totalCount,
      items: responseArrayWithId(postsFromDb),
    };
  },
  async getPostById(id: string) {
    return await postsRepository.getPostById(id);
  },

  async addNewPost(
    req: Request<{}, {}, postRequestTypeWithBody>,
    blogName: string,
  ): Promise<WithId<PostViewType> | null> {
    const newPost: NewPostType = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
      blogName: blogName,
      createdAt: new Date().toISOString(),
    };
    return await postsRepository.addNewPost(newPost);
  },
  async updatePost(
    req: Request<postRequestTypeWithParams, {}, postRequestTypeWithBody>,
    blogName: string,
  ): Promise<boolean> {
    const updatedPost: PostForUpdateType = {
      id: req.params.id,
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
      blogName: req.body.blogName || blogName,
    };
    return await postsRepository.updatePostById(updatedPost);
  },
  async deletePostById(id: string): Promise<boolean> {
    return await postsRepository.deletePostById(id);
  },
};
