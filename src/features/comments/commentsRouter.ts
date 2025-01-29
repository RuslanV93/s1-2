import { Router } from 'express';
import {
  accessTokenValidator,
  softAuthMiddleware,
} from '../../validators/authValidator';
import {
  commentContentValidator,
  inputValidationMiddleware,
  likesStatusValidator,
  validateObjectId,
} from '../../validators/fieldsValidators';
import { commentsController } from '../../ioc/compositionRoot';

export const commentsRouter = Router();

commentsRouter.get(
  '/:id',
  softAuthMiddleware,
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
commentsRouter.put(
  '/:id/like-status',
  accessTokenValidator,
  validateObjectId,
  softAuthMiddleware,
  likesStatusValidator,
  inputValidationMiddleware,
  commentsController.updateLikeStatus.bind(commentsController),
);
