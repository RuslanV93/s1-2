import { blogsRepository } from '../modules/blogs/repositories/blogsRepository';

import { body } from 'express-validator';

export const blogByIdExists = () => {
  return body('blogId').custom(async (value) => {
    const blog = await blogsRepository.getBlogById(value);
    if (!blog) {
      throw new Error('Blog not found. Incorrect id.');
    }
    return true;
  });
};
