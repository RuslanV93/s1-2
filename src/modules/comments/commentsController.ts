import { Router } from 'express';
import { getComments } from './handlers/getComments';
import { updateComment } from './handlers/updateComment';
import { deleteComment } from './handlers/deleteComment';

export const commentsRouter = Router();

const commentsController = {
  getComments: getComments,
  updateComment: updateComment,
  deleteComment: deleteComment,
};

commentsRouter.get('/', commentsController.getComments);
commentsRouter.put('/:id', commentsController.updateComment);
commentsRouter.delete('/:id', commentsController.deleteComment);
