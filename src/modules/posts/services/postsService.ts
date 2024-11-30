import { postsRepository } from '../repositories/postsRepository';
import { Request } from 'express';
import {
  postRequestTypeWithBody,
  postRequestTypeWithParams,
} from '../types/postsRequestResponseTypes';
import { NewPostType, PostForUpdateType, PostViewType } from '../../../types/db.type';
import { ObjectId, WithId } from 'mongodb';

// posts bll service methods

export const postsService = {
  // add new post to DB method
  async addNewPost(
    req: Request<{}, {}, postRequestTypeWithBody>,
    blogName: string,
  ): Promise<PostViewType | null> {
    const newPost: NewPostType = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: new ObjectId(req.body.blogId),
      blogName: blogName,
      createdAt: new Date().toISOString(),
    };

    const newPostId = await postsRepository.addNewPost(newPost);
    if (!newPostId) {
      return null;
    }
    const newAddedPost = await postsRepository.getPostById(newPostId);
    if (!newPost) {
      return null;
    }
    return newAddedPost;
  },

  // update post fields
  async updatePost(
    req: Request<postRequestTypeWithParams, {}, postRequestTypeWithBody>,
    blogName: string,
  ): Promise<boolean> {
    const updatedPost: PostForUpdateType = {
      id: req.params.id,
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: new ObjectId(req.body.blogId),
      blogName: blogName,
    };

    return await postsRepository.updatePostById(updatedPost);
  },

  // delete existing post by id
  async deletePostById(id: string): Promise<boolean> {
    return await postsRepository.deletePostById(id);
  },
};
