import { Request, Response } from 'express';
import {
  PostRequestTypeQuery,
  PostRequestTypeWithBody,
  PostRequestTypeWithParams,
} from '../types/postsRequestResponseTypes';
import { getQueryFromRequest } from '../../../common/helpers/getQueryFromRequest';
import { STATUSES } from '../../../common/variables/variables';
import { PostViewType } from '../types/postsTypes';
import { ObjectId } from 'mongodb';

import {
  CommentsRequestWithBodyType,
  CommentsRequestWithParamsType,
} from '../../comments/types/commentsResponseRequestTypes';
import { UserViewType } from '../../users/types/usersTypes';
import { DomainStatusCode } from '../../../common/types/types';
import { resultCodeToHttpFunction } from '../../../common/helpers/resultCodeToHttpFunction';
import { PostsService } from '../services/postsService';
import { PostsRepository } from '../repositories/postsRepository';
import { PostsQueryRepository } from '../repositories/postsQueryRepository';
import { CommentsRepository } from '../../comments/repositories/commentsRepository';
import { CommentsQueryRepository } from '../../comments/repositories/commentsQueryRepository';
import { CommentsService } from '../../comments/services/commentsService';
import {
  AllCommentsViewType,
  MyLikesStatus,
} from '../../comments/types/commentsTypes';
import { BlogsRepository } from '../../blogs/repositories/blogsRepository';
import { inject } from 'inversify';
import {
  LikeResponseWithBodyType,
  LikeResponseWithParamsType,
} from '../../likes/types/likesRequestResponseTypes';
import { LikesQueryRepository } from '../../likes/repositories/likesQueryRepository';
import { UsersQueryRepository } from '../../users/repositories/usersQueryRepository';
import { LikesService } from '../../likes/services/likesService';

export class PostsController {
  constructor(
    @inject(PostsService) protected postsService: PostsService,
    @inject(LikesService) protected likesService: LikesService,
    @inject(PostsRepository) protected postsRepository: PostsRepository,
    @inject(PostsQueryRepository)
    protected postsQueryRepository: PostsQueryRepository,
    @inject(CommentsService) protected commentsService: CommentsService,
    @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
    @inject(CommentsQueryRepository)
    protected commentsQueryRepository: CommentsQueryRepository,
    @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
    @inject(LikesQueryRepository)
    protected likesQueryRepository: LikesQueryRepository,
    @inject(UsersQueryRepository)
    protected usersQueryRepository: UsersQueryRepository,
  ) {}
  async getPosts(req: Request<{}, PostRequestTypeQuery>, res: Response) {
    const userId = req.user.id;
    const paginationParams: PostRequestTypeQuery =
      getQueryFromRequest.getQueryFromRequest(req);
    const posts = await this.postsQueryRepository.getPosts(paginationParams, userId);
    res.status(STATUSES.OK_200).send(posts);
  }

  /** getting post by post id */
  async getPostById(req: Request<PostRequestTypeWithParams>, res: Response) {
    const id = req.params.id;
    const userId = req.user.id;
    const post: PostViewType | null = await this.postsQueryRepository.getPostById(
      id,
      userId,
    );

    if (!post) {
      res.sendStatus(STATUSES.NOT_FOUND_404);
      return;
    }
    res.status(STATUSES.OK_200).send(post);
  }

  /** add new post */
  async addNewPost(req: Request<{}, {}, PostRequestTypeWithBody>, res: Response) {
    const existingBlogToAddNewPost = await this.blogsRepository.getBlogById(
      new ObjectId(req.body.blogId),
    );
    const userId = req.user.id ? req.user.id : 'none';
    if (!existingBlogToAddNewPost) {
      res.status(STATUSES.BAD_REQUEST_400).send('Blog not found. Incorrect blog ID');
      return;
    }
    // getting new added post id for request and check is post added
    const newAddedPostId = await this.postsService.addNewPost(
      req.body,
      existingBlogToAddNewPost.name,
    );
    if (!newAddedPostId) {
      res.sendStatus(STATUSES.BAD_REQUEST_400);
      return;
    }
    const newAddedPost = await this.postsQueryRepository.getPostById(
      newAddedPostId,
      userId,
    );
    if (!newAddedPost) {
      res.sendStatus(STATUSES.BAD_REQUEST_400);
      return;
    }
    res.status(STATUSES.CREATED_201).send(newAddedPost);
  }

  /** delete 1 post by post id */
  async deletePost(req: Request<PostRequestTypeWithParams>, res: Response) {
    const postForDelete = await this.postsRepository.getPostById(
      new ObjectId(req.params.id),
    );

    if (!postForDelete) {
      res.status(STATUSES.NOT_FOUND_404).send('Post not found. Incorrect ID');
      return;
    }
    const deleteResult = await this.postsService.deletePostById(postForDelete._id);

    if (!deleteResult) {
      res.status(500).send('Something went wrong');
      return;
    }
    res.sendStatus(STATUSES.NO_CONTENT_204);
  }

  /** update post fields */
  async updatePost(
    req: Request<PostRequestTypeWithParams, {}, PostRequestTypeWithBody>,
    res: Response,
  ) {
    const blogForUpdate = await this.blogsRepository.getBlogById(
      new ObjectId(req.body.blogId),
    );

    if (!blogForUpdate) {
      res
        .status(STATUSES.BAD_REQUEST_400)
        .send('Blog not exists. Incorrect blog ID!');
      return;
    }

    const postToUpdate = await this.postsRepository.getPostById(
      new ObjectId(req.params.id),
    );

    if (!postToUpdate) {
      res
        .status(STATUSES.NOT_FOUND_404)
        .send('Posts not exists. Incorrect post ID!');
      return;
    }

    const updatedResult = await this.postsService.updatePost(
      req.body,
      req.params.id,
      blogForUpdate.name,
    );

    if (!updatedResult) {
      res.sendStatus(STATUSES.NOT_FOUND_404);
      return;
    }
    res.sendStatus(STATUSES.NO_CONTENT_204);
  }

  /** getting commentary by post id */
  async getCommentsByPostId(req: Request, res: Response) {
    const userId: string = req.user.id;
    const existingPostId: ObjectId | null = await this.commentsRepository.findPost(
      req.params.id,
    );

    if (!existingPostId) {
      res.status(STATUSES.NOT_FOUND_404).send('Post not found.');
      return;
    }
    req.query.search = req.params.id;
    const paginationAndSearchParams = getQueryFromRequest.getQueryFromRequest(req);
    const comments: AllCommentsViewType | null =
      await this.commentsQueryRepository.getComments(
        paginationAndSearchParams,
        userId,
      );
    if (!comments) {
      res
        .status(STATUSES.INTERNAL_ERROR_500)
        .send({ message: 'something went wrong' });
      return;
    }
    res.status(STATUSES.OK_200).send(comments);
  }

  /** add new commentary using posts endpoint */
  async addNewCommentToPost(
    req: Request<CommentsRequestWithParamsType, {}, CommentsRequestWithBodyType>,
    res: Response,
  ) {
    const userId = req.user.id;
    if (!userId) {
      res.sendStatus(STATUSES.UNAUTHORIZED_401);
      return;
    }

    const commentator: UserViewType | null =
      await this.usersQueryRepository.getUserById(userId);

    const commentatorInfo = {
      userId: new ObjectId(userId),
      userLogin: commentator!.login,
    };

    const newAddedCommentResult = await this.commentsService.addNewComment(
      req.params.id,
      req.body,
      commentatorInfo,
    );
    if (newAddedCommentResult.status !== DomainStatusCode.Success) {
      res.sendStatus(resultCodeToHttpFunction(newAddedCommentResult.status));
      return;
    }

    const newAddedComment = await this.commentsQueryRepository.getCommentById(
      newAddedCommentResult.data!.toString(),
      userId,
    );
    res.status(STATUSES.CREATED_201).send(newAddedComment);
  }

  /** New like/dislike status, update existing like/dislike status */
  async updateLikeStatus(
    req: Request<LikeResponseWithParamsType, {}, LikeResponseWithBodyType>,
    res: Response,
  ) {
    const userId = req.user.id;
    const postId = req.params.id;
    const newLikeStatus = req.body.likeStatus as MyLikesStatus;

    try {
      const existingLikeStatus = await this.likesQueryRepository.getPostLikesStatus(
        postId,
        userId,
      );
      if (!existingLikeStatus.status) {
        res.status(STATUSES.INTERNAL_ERROR_500).send('Something went wrong');
        return;
      }
      const updateResult = await this.likesService.updatePostLikeStatus(
        postId,
        userId,
        existingLikeStatus.status,
        newLikeStatus,
      );
      if (updateResult.status !== DomainStatusCode.Success) {
        res
          .status(resultCodeToHttpFunction(updateResult.status))
          .send(updateResult.extensions);
        return;
      }
      res.sendStatus(STATUSES.NO_CONTENT_204);
    } catch (error) {
      console.error(error);
      res.status(STATUSES.INTERNAL_ERROR_500).send(error);
      return;
    }
  }
}
