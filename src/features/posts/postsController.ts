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
  commentContentValidator,
  contentValidator,
  inputValidationMiddleware,
  shortDescriptionValidator,
  titleValidator,
  validateObjectId,
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
postsRouter.get(
  '/:id',
  validateObjectId,
  inputValidationMiddleware,
  postsController.getPostById,
);

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
postsRouter.delete(
  '/:id',
  authValidatorMiddleware,
  validateObjectId,
  inputValidationMiddleware,
  postsController.deletePost,
);

//update post fields
postsRouter.put(
  '/:id',
  authValidatorMiddleware,
  validateObjectId,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  ...blogIdValidator,
  inputValidationMiddleware,
  postsController.updatePost,
);

// getting all comments by post id
postsRouter.get(
  '/:id/comments',
  validateObjectId,
  inputValidationMiddleware,
  postsController.getCommentsByPostId,
);

// add new comment to post
postsRouter.post(
  '/:id/comments',
  accessTokenValidator,
  validateObjectId,
  commentContentValidator,
  inputValidationMiddleware,
  postsController.addNewCommentToPost,
);
