import { Router } from 'express';
import { getPosts } from './handlers/getPosts';
import { getPostById } from './handlers/getPostById';
import { addNewPost } from './handlers/addNewPost';
import { deletePost } from './handlers/deletePost';
import { updatePost } from './handlers/updatePost';
import { authValidatorMiddleware } from '../../validators/authValidator';
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

export const postsRouter = Router();
export const postsController = {
  getPosts,
  getPostById,
  addNewPost,
  deletePost,
  updatePost,
};

postsRouter.get(
  '/',
  sortValidator,
  queryFieldsValidatorMiddleware,
  postsController.getPosts,
);
postsRouter.get('/:id', postsController.getPostById);

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
postsRouter.delete('/:id', authValidatorMiddleware, postsController.deletePost);
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
