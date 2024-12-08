import { Router } from 'express';
import { getCommentById } from './handlers/getCommentById';
import { updateComment } from './handlers/updateComment';
import { deleteComment } from './handlers/deleteComment';
import { accessTokenValidator } from '../../validators/authValidator';
import {
  commentContentValidator,
  inputValidationMiddleware,
} from '../../validators/fieldsValidators';

export const commentsRouter = Router();

const commentsController = {
  getCommentById: getCommentById,
  updateComment: updateComment,
  deleteComment: deleteComment,
};

commentsRouter.get('/:id', commentsController.getCommentById);
commentsRouter.put(
  '/:id',
  accessTokenValidator,
  commentContentValidator,
  inputValidationMiddleware,
  commentsController.updateComment,
);
commentsRouter.delete('/:id', accessTokenValidator, commentsController.deleteComment);
