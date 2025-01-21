import { body } from 'express-validator';
import { ObjectId } from 'mongodb';
import { blogsRepository } from '../infrastructure/compositionRoot';

export const blogByIdExists = () => {
  return body('blogId').custom(async (value, { req }) => {
    const blogId: string = value || req.params?.id;

    const blog = await blogsRepository.getBlogById(new ObjectId(blogId));
    if (!blog) {
      throw new Error('Blog not found. Incorrect id.');
    }
    return true;
  });
};
