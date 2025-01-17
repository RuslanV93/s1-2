import { CommentsRepository } from '../features/comments/repositories/commentsRepository';
import { CommentsQueryRepository } from '../features/comments/repositories/commentsQueryRepository';
import { CommentsService } from '../features/comments/services/commentsService';
import { CommentsController } from '../features/comments/controller/commentsController';
import { LikesQueryRepository } from '../features/likes/repositories/likesQueryRepository';
import { LikesRepository } from '../features/likes/repositories/likesRepository';
import { LikesService } from '../features/likes/services/likesService';
import { likeStatusChange } from '../features/likes/utils/handleLikeStatusChange';

// LIKES
export const likesQueryRepository = new LikesQueryRepository();
export const likesRepository = new LikesRepository();
export const likesService = new LikesService(likesRepository, likeStatusChange);

// COMMENTS
export const commentsRepository = new CommentsRepository();
export const commentsQueryRepository = new CommentsQueryRepository();
export const commentsService = new CommentsService(commentsRepository);
export const commentsController = new CommentsController(
  commentsQueryRepository,
  commentsService,
  likesQueryRepository,
  likesService,
);
