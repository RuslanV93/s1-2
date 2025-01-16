import { CommentsRepository } from '../features/comments/repositories/commentsRepository';
import { CommentsQueryRepository } from '../features/comments/repositories/commentsQueryRepository';
import { CommentsService } from '../features/comments/services/commentsService';
import { CommentsController } from '../features/comments/controller/commentsController';

// COMMENTS
export const commentsRepository = new CommentsRepository();
export const commentsQueryRepository = new CommentsQueryRepository();
export const commentsService = new CommentsService(commentsRepository);
export const commentsController = new CommentsController(
  commentsQueryRepository,
  commentsService,
);
