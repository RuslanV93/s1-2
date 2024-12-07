import { Router } from 'express';
import { getPosts } from './handlers/getPosts';
import { getPostById } from './handlers/getPostById';
import { addNewPost } from './handlers/addNewPost';
import { deletePost } from './handlers/deletePost';
import { updatePost } from './handlers/updatePost';
import {
  accessTokenValidator,
  authValidatorMiddleware,
} from '../../validators/authValidator';
import {
  blogIdValidator,
  contentValidator,
  inputValidationMiddleware,
  shortDescriptionValidator,
  titleValidator,
} from '../../validators/fieldsValidators';
import {
  queryFieldsValidatorMiddleware,
  sortValidator,
} from '../../validators/queryValidators';
import { addNewCommentToPost } from './handlers/addNewCommentToPost';
import { getCommentsByPostId } from './handlers/getCommentsByPostId';

// Router
export const postsRouter = Router();

// Controller methods
export const postsController = {
  getPosts,
  getPostById,
  addNewPost,
  deletePost,
  updatePost,
  getCommentsByPostId,
  addNewCommentToPost,
};

// get all posts
postsRouter.get(
  '/',
  sortValidator,
  queryFieldsValidatorMiddleware,
  postsController.getPosts,
);

//get post by id
postsRouter.get('/:id', postsController.getPostById);

// add new post
postsRouter.post(
  '/',
  authValidatorMiddleware,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  ...blogIdValidator,
  inputValidationMiddleware,
  postsController.addNewPost,
);

// delete existing post
postsRouter.delete('/:id', authValidatorMiddleware, postsController.deletePost);

//update post fields
postsRouter.put(
  '/:id',
  authValidatorMiddleware,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  ...blogIdValidator,
  inputValidationMiddleware,
  postsController.updatePost,
);

postsRouter.get('/:id/comments', postsController.getCommentsByPostId);
postsRouter.post(
  '/:id/comments',
  accessTokenValidator,
  postsController.addNewCommentToPost,
);
