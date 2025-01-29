import { Router } from 'express';
import {
  blogIdValidator,
  contentValidator,
  descriptionValidator,
  inputValidationMiddleware,
  nameValidator,
  shortDescriptionValidator,
  titleValidator,
  validateObjectId,
  webSiteUrlValidator,
} from '../../validators/fieldsValidators';
import {
  authValidatorMiddleware,
  softAuthMiddleware,
} from '../../validators/authValidator';
import {
  queryFieldsValidatorMiddleware,
  sortValidator,
} from '../../validators/queryValidators';
import { blogsController } from '../../ioc/compositionRoot';

// blogs router
export const blogsRouter = Router();

blogsRouter.get(
  '/',
  sortValidator,
  queryFieldsValidatorMiddleware,
  blogsController.getBlogs.bind(blogsController),
);
blogsRouter.get(
  '/:id',
  validateObjectId,
  inputValidationMiddleware,
  blogsController.getBlogsById.bind(blogsController),
);
blogsRouter.post(
  '/',
  authValidatorMiddleware,
  nameValidator,
  descriptionValidator,
  webSiteUrlValidator,
  inputValidationMiddleware,
  blogsController.addNewBlog.bind(blogsController),
);
blogsRouter.delete(
  '/:id',
  authValidatorMiddleware,
  validateObjectId,
  inputValidationMiddleware,
  blogsController.deleteBlog.bind(blogsController),
);
blogsRouter.put(
  '/:id',
  authValidatorMiddleware,
  nameValidator,
  descriptionValidator,
  webSiteUrlValidator,
  validateObjectId,
  inputValidationMiddleware,
  blogsController.updateBlog.bind(blogsController),
);
blogsRouter.get(
  '/:id/posts',
  validateObjectId,
  softAuthMiddleware,
  sortValidator,
  queryFieldsValidatorMiddleware,
  inputValidationMiddleware,
  blogsController.getPostsByBlogId.bind(blogsController),
);
blogsRouter.post(
  '/:id/posts',
  authValidatorMiddleware,
  softAuthMiddleware,
  validateObjectId,
  ...blogIdValidator,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  inputValidationMiddleware,
  blogsController.addNewPostToBlog.bind(blogsController),
);
