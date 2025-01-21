import { CommentsRepository } from '../features/comments/repositories/commentsRepository';
import { CommentsQueryRepository } from '../features/comments/repositories/commentsQueryRepository';
import { CommentsService } from '../features/comments/services/commentsService';
import { CommentsController } from '../features/comments/controller/commentsController';
import { LikesQueryRepository } from '../features/likes/repositories/likesQueryRepository';
import { LikesRepository } from '../features/likes/repositories/likesRepository';
import { LikesService } from '../features/likes/services/likesService';
import { likeStatusChange } from '../features/likes/utils/handleLikeStatusChange';
import { PostsController } from '../features/posts/controller/postsController';
import { PostsRepository } from '../features/posts/repositories/postsRepository';
import { PostsQueryRepository } from '../features/posts/repositories/postsQueryRepository';
import { PostsService } from '../features/posts/services/postsService';
import { BlogsRepository } from '../features/blogs/repositories/blogsRepository';
import { BlogsQueryRepository } from '../features/blogs/repositories/blogsQueryRepository';
import { BlogsService } from '../features/blogs/services/blogsService';
import { BlogsController } from '../features/blogs/controller/blogsController';

// REPOSITORIES
export const likesQueryRepository = new LikesQueryRepository();
export const likesRepository = new LikesRepository();
export const commentsRepository = new CommentsRepository();
export const commentsQueryRepository = new CommentsQueryRepository(
  likesQueryRepository,
);
export const postsRepository = new PostsRepository();
export const postsQueryRepository = new PostsQueryRepository();
export const blogsRepository = new BlogsRepository();
export const blogsQueryRepository = new BlogsQueryRepository();

// SERVICES
export const commentsService = new CommentsService(
  commentsRepository,
  likesRepository,
);
export const likesService = new LikesService(
  likesRepository,
  likeStatusChange,
  commentsRepository,
);
export const postsService = new PostsService(postsRepository);
export const blogsService = new BlogsService(blogsRepository);

// CONTROLLERS
export const commentsController = new CommentsController(
  commentsRepository,
  commentsQueryRepository,
  commentsService,
  likesQueryRepository,
  likesService,
);
export const postsController = new PostsController(
  postsService,
  postsRepository,
  postsQueryRepository,
  commentsService,
  commentsRepository,
  commentsQueryRepository,
  blogsRepository,
);
export const blogsController = new BlogsController(
  blogsRepository,
  blogsQueryRepository,
  blogsService,
  postsQueryRepository,
  postsService,
);
