import { Router } from 'express';
import {
  accessTokenValidator,
  authValidatorMiddleware,
  softAuthMiddleware,
} from '../../validators/authValidator';
import {
  blogIdValidator,
  commentContentValidator,
  contentValidator,
  inputValidationMiddleware,
  likesStatusValidator,
  shortDescriptionValidator,
  titleValidator,
  validateObjectId,
} from '../../validators/fieldsValidators';
import {
  queryFieldsValidatorMiddleware,
  sortValidator,
} from '../../validators/queryValidators';
import { postsController } from '../../ioc/compositionRoot';

// Router
export const postsRouter = Router();

// get all posts
postsRouter.get(
  '/',
  sortValidator,
  softAuthMiddleware,
  queryFieldsValidatorMiddleware,
  postsController.getPosts.bind(postsController),
);

//get post by id
postsRouter.get(
  '/:id',
  validateObjectId,
  softAuthMiddleware,
  inputValidationMiddleware,
  postsController.getPostById.bind(postsController),
);

// add new post
postsRouter.post(
  '/',
  authValidatorMiddleware,
  softAuthMiddleware,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  ...blogIdValidator,
  inputValidationMiddleware,
  postsController.addNewPost.bind(postsController),
);

// delete existing post
postsRouter.delete(
  '/:id',
  authValidatorMiddleware,
  validateObjectId,
  inputValidationMiddleware,
  postsController.deletePost.bind(postsController),
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
  postsController.updatePost.bind(postsController),
);

// getting all comments by post id
postsRouter.get(
  '/:id/comments',
  validateObjectId,
  softAuthMiddleware,
  inputValidationMiddleware,
  postsController.getCommentsByPostId.bind(postsController),
);

// add new comment to post
postsRouter.post(
  '/:id/comments',
  accessTokenValidator,
  validateObjectId,
  commentContentValidator,
  inputValidationMiddleware,
  postsController.addNewCommentToPost.bind(postsController),
);

postsRouter.put(
  '/:id/like-status',
  accessTokenValidator,
  validateObjectId,
  likesStatusValidator,
  inputValidationMiddleware,
  postsController.updateLikeStatus.bind(postsController),
);
