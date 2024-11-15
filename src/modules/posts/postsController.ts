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
} from '../../validators/FieldsValidators';
import { blogByIdExists } from '../../validators/blogExistsCustomValidator';
import { findObjectById } from '../../helpers/findById';

export const postsRouter = Router();
export const postsController = {
  getPosts,
  getPostById,
  addNewPost,
  deletePost,
  updatePost,
};

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/:id', postsController.getPostById);

postsRouter.post(
  '/',
  authValidatorMiddleware,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  blogIdValidator,
  inputValidationMiddleware,
  postsController.addNewPost,
);
postsRouter.delete(
  '/:id',
  authValidatorMiddleware,
  findObjectById,
  postsController.deletePost,
);
postsRouter.put(
  '/:id',
  authValidatorMiddleware,
  findObjectById,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  blogIdValidator,
  inputValidationMiddleware,
  postsController.updatePost,
);
