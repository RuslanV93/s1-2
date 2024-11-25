import { Router } from 'express';
import { getBlogs } from './handlers/getBlogs';
import { getBlogById } from './handlers/getBlogById';
import { addNewBlog } from './handlers/addNewBlog';
import { deleteBlog } from './handlers/deleteBlog';
import { updateBlog } from './handlers/updateBlog';
import {
  blogIdValidator,
  contentValidator,
  descriptionValidator,
  inputValidationMiddleware,
  nameValidator,
  shortDescriptionValidator,
  titleValidator,
  webSiteUrlValidator,
} from '../../validators/fieldsValidators';
import { authValidatorMiddleware } from '../../validators/authValidator';
import { getPostsByBlogId } from './handlers/getPostsByBlogId';
import { addNewPostToBlog } from './handlers/addNewPostToBlog';
import {
  queryFieldsValidatorMiddleware,
  sortValidator,
} from '../../validators/queryValidators';

export const blogsRouter = Router();

const blogsController = {
  getBlogs: getBlogs,
  getBlogsById: getBlogById,
  addNewBlog: addNewBlog,
  deleteBlog: deleteBlog,
  updateBlog: updateBlog,
  getPostsByBlogId: getPostsByBlogId,
  addNewPostToBlog: addNewPostToBlog,
};

blogsRouter.get(
  '/',
  sortValidator,
  queryFieldsValidatorMiddleware,
  blogsController.getBlogs,
);
blogsRouter.get('/:id', blogsController.getBlogsById);
blogsRouter.post(
  '/',
  authValidatorMiddleware,
  nameValidator,
  descriptionValidator,
  webSiteUrlValidator,
  inputValidationMiddleware,
  blogsController.addNewBlog,
);
blogsRouter.delete('/:id', authValidatorMiddleware, blogsController.deleteBlog);
blogsRouter.put(
  '/:id',
  authValidatorMiddleware,
  nameValidator,
  descriptionValidator,
  webSiteUrlValidator,
  inputValidationMiddleware,
  blogsController.updateBlog,
);
blogsRouter.get(
  '/:id/posts',
  sortValidator,
  queryFieldsValidatorMiddleware,
  blogsController.getPostsByBlogId,
);
blogsRouter.post(
  '/:id/posts',
  authValidatorMiddleware,
  ...blogIdValidator,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  inputValidationMiddleware,
  blogsController.addNewPostToBlog,
);
