import { CommentsRequestWithBodyType } from '../types/commentsResponseRequestTypes';
import { CommentatorInfoType, NewCommentType } from '../types/commentsTypes';
import { ObjectId } from 'mongodb';
import { DomainStatusCode, ResultObject } from '../../../common/types/types';
import { CommentsRepository } from '../repositories/commentsRepository';
import { LikesRepository } from '../../likes/repositories/likesRepository';
import { inject, injectable } from 'inversify';

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
    @inject(LikesRepository) protected likesRepository: LikesRepository,
  ) {}
  // adding new comment
  async addNewComment(
    postId: string,
    body: CommentsRequestWithBodyType,
    commentatorInfo: CommentatorInfoType,
  ): Promise<ResultObject<null | ObjectId>> {
    const existingPostToAddCommentId =
      await this.commentsRepository.findPost(postId);

    if (!existingPostToAddCommentId) {
      return {
        status: DomainStatusCode.NotFound,
        data: null,
        extensions: [{ message: 'Post not found' }],
      };
    }
    const newComment: NewCommentType = {
      postId: new ObjectId(postId),
      content: body.content,
      commentatorInfo: commentatorInfo,
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    };

    const newCommentId: ObjectId | null =
      await this.commentsRepository.addNewComment(newComment);
    if (!newCommentId) {
      return {
        status: DomainStatusCode.InternalServerError,
        data: null,
        extensions: [{ message: 'Internal server error.' }],
      };
    }
    return {
      status: DomainStatusCode.Success,
      data: newCommentId,
      extensions: [{ message: 'Comment added' }],
    };
  }

  // update existing comment
  async updateComment(userId: string, commentId: string, updatedComment: string) {
    const commentToUpdate = await this.commentsRepository.findComment(commentId);
    if (!commentToUpdate) {
      return {
        status: DomainStatusCode.NotFound,
        data: null,
        extensions: [{ message: 'Commentary not found' }],
      };
    }
    if (userId !== commentToUpdate.commentatorInfo.userId.toString()) {
      return {
        status: DomainStatusCode.Forbidden,
        data: null,
        extensions: [{ message: 'Not owner of this comment.' }],
      };
    }
    const commentUpdateResult = await this.commentsRepository.updateComment(
      commentId,
      updatedComment,
    );
    if (!commentUpdateResult) {
      return {
        status: DomainStatusCode.InternalServerError,
        data: null,
        extensions: [{ message: 'Something went wrong.' }],
      };
    }
    return {
      status: DomainStatusCode.Success,
      data: null,
      extensions: [{ message: 'Comment update success.' }],
    };
  }

  // delete comment by ID
  async deleteComment(commentId: string, userId: string) {
    try {
      const commentToDelete = await this.commentsRepository.findComment(commentId);
      if (!commentToDelete) {
        return {
          status: DomainStatusCode.NotFound,
          data: null,
          extensions: [{ message: 'Commentary not found.' }],
        };
      }
      if (userId !== commentToDelete.commentatorInfo.userId.toString()) {
        return {
          status: DomainStatusCode.Forbidden,
          data: null,
          extensions: [{ message: 'Not owner of this comment' }],
        };
      }
      /** Delete commentary */
      const commentDeleteResult =
        await this.commentsRepository.deleteComment(commentId);
      if (commentDeleteResult !== 1) {
        return {
          status: DomainStatusCode.InternalServerError,
          data: null,
          extensions: [{ message: 'Something went wrong.' }],
        };
      }
      /** Delete likes when comment has been deleted */
      await this.likesRepository.deleteCommentLikeEntity(commentId);

      return {
        status: DomainStatusCode.Success,
        data: null,
        extensions: [],
      };
    } catch (error) {
      return {
        status: DomainStatusCode.InternalServerError,
        data: null,
        extensions: [{ message: 'Something went wrong.' }],
      };
    }
  }
}
