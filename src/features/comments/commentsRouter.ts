import { Router } from 'express';
import { accessTokenValidator } from '../../validators/authValidator';
import {
  commentContentValidator,
  inputValidationMiddleware,
  validateObjectId,
} from '../../validators/fieldsValidators';
import { commentsController } from '../../infrastructure/compositionRoot';

export const commentsRouter = Router();

commentsRouter.get(
  '/:id',
  validateObjectId,
  inputValidationMiddleware,
  commentsController.getCommentById.bind(commentsController),
);
commentsRouter.put(
  '/:id',
  accessTokenValidator,
  commentContentValidator,
  validateObjectId,
  inputValidationMiddleware,
  commentsController.updateComment.bind(commentsController),
);
commentsRouter.delete(
  '/:id',
  validateObjectId,
  accessTokenValidator,
  inputValidationMiddleware,
  commentsController.deleteComment.bind(commentsController),
);
commentsRouter.get(
  '/:id/like-status',
  accessTokenValidator,
  commentsController.updateLikeStatus.bind(commentsController),
);
