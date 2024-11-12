import { Router } from 'express';
import { getPosts } from './handlers/getPosts';
import { getPostById } from './handlers/getPostById';
import { addNewPost } from './handlers/addNewPost';

export const postsRouter = Router();
export const postsController = {
  getPosts: getPosts,
  getPostById: getPostById,
  addNewPost: addNewPost,
};

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/:id', postsController.getPostById);
postsRouter.post('/', postsController.addNewPost);
