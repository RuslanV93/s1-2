import { Router } from 'express';
import { getBlogs } from './handlers/getBlogs';
import { getBlogById } from './handlers/getBlogById';
import { addNewBlog } from './handlers/addNewBlog';
import { deleteBlog } from './handlers/deleteBlog';
import { updateBlog } from './handlers/updateBlog';
import {
  descriptionValidator,
  inputValidationMiddleware,
  nameValidator,
  webSiteUrlValidator,
} from '../../validators/fieldsValidators';
import { authValidatorMiddleware } from '../../validators/authValidator';

export const blogsRouter = Router();

const blogsController = {
  getBlogs: getBlogs,
  getBlogsById: getBlogById,
  addNewBlog: addNewBlog,
  deleteBlog: deleteBlog,
  updateBlog: updateBlog,
};

blogsRouter.get('/', blogsController.getBlogs);
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
