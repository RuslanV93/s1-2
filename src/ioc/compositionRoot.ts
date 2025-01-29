import 'reflect-metadata';
import { CommentsRepository } from '../features/comments/repositories/commentsRepository';
import { CommentsQueryRepository } from '../features/comments/repositories/commentsQueryRepository';
import { CommentsService } from '../features/comments/services/commentsService';
import { LikesQueryRepository } from '../features/likes/repositories/likesQueryRepository';
import { LikesRepository } from '../features/likes/repositories/likesRepository';
import { LikesService } from '../features/likes/services/likesService';
import { LikeStatusChange } from '../features/likes/utils/handleLikeStatusChange';
import { PostsRepository } from '../features/posts/repositories/postsRepository';
import { PostsQueryRepository } from '../features/posts/repositories/postsQueryRepository';
import { PostsService } from '../features/posts/services/postsService';
import { BlogsRepository } from '../features/blogs/repositories/blogsRepository';
import { BlogsQueryRepository } from '../features/blogs/repositories/blogsQueryRepository';
import { BlogsService } from '../features/blogs/services/blogsService';
import { Container } from 'inversify';
import { CommentsController } from '../features/comments/controller/commentsController';
import { PostsController } from '../features/posts/controller/postsController';
import { BlogsController } from '../features/blogs/controller/blogsController';
import { BlogModel } from '../features/blogs/domain/blogs.entity';
import { PostModel } from '../features/posts/domain/posts.entity';
import { BlogsModelType } from '../features/blogs/types/blogsTypes';
import { PostsModelType } from '../features/posts/types/postsTypes';
import { UsersQueryRepository } from '../features/users/repositories/usersQueryRepository';
import { UsersRepository } from '../features/users/repositories/usersRepository';
import { UsersService } from '../features/users/services/usersService';
import { UsersController } from '../features/users/controller/usersController';
import {
  PostLikeModelType,
  PostLikesModel,
} from '../features/likes/domain/likes.entity';

export const container = new Container();

// bind repositories
container.bind(LikesQueryRepository).to(LikesQueryRepository);
container.bind(LikesRepository).to(LikesRepository);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind(PostsRepository).to(PostsRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);
container.bind(UsersRepository).to(UsersRepository);

// bind services
container.bind(CommentsService).to(CommentsService);
container.bind(LikesService).to(LikesService);
container.bind(PostsService).to(PostsService);
container.bind(BlogsService).to(BlogsService);
container.bind(UsersService).to(UsersService);

// bind controllers
container.bind(CommentsController).to(CommentsController);
container.bind(PostsController).to(PostsController);
container.bind(BlogsController).to(BlogsController);
container.bind(UsersController).to(UsersController);

// bind others (utils)
container.bind(LikeStatusChange).to(LikeStatusChange);

//models
container.bind<BlogsModelType>(BlogModel).toConstantValue(BlogModel);
container.bind<PostsModelType>(PostModel).toConstantValue(PostModel);
container.bind<PostLikeModelType>(PostLikesModel).toConstantValue(PostLikesModel);

export const usersQueryRepository = container.get(UsersQueryRepository);
export const usersRepository = container.get(UsersRepository);
export const blogsController = container.get<BlogsController>(BlogsController);
export const commentsController =
  container.get<CommentsController>(CommentsController);
export const postsController = container.get<PostsController>(PostsController);
export const blogsRepository = container.get<BlogsRepository>(BlogsRepository);
export const usersController = container.get<UsersController>(UsersController);
