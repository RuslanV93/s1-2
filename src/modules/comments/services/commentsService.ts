import { CommentsRequestWithBodyType } from '../types/commentsResponseRequestTypes';
import {
  commentatorInfoType,
  NewCommentType,
  UpdateCommentType,
} from '../types/commentsTypes';
import { commentsRepository } from '../repositories/commentsRepository';

import { ObjectId } from 'mongodb';

enum DomainStatusCode {
  Success = 0,
  NotFound = 1,
  Forbidden = 2,
  InternalServerError = 5,
}
type Extensions = {
  message: string;
  field?: string;
};
type Result<Data> = {
  status: DomainStatusCode;
  extensions: Extensions[];
  data: Data;
};
export const commentsService = {
  // adding new comment
  async addNewComment(
    postId: string,
    body: CommentsRequestWithBodyType,
    commentatorInfo: commentatorInfoType,
  ): Promise<Result<null | ObjectId>> {
    const existingPostToAddCommentId = await commentsRepository.findPost(postId);

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
    };

    const newCommentId: ObjectId | null =
      await commentsRepository.addNewComment(newComment);
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
  },

  // update existing comment
  async updateComment(userId: string, commentId: string, updatedComment: string) {
    const commentToUpdate = await commentsRepository.findComment(commentId);
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
    const commentUpdateResult = await commentsRepository.updateComment(
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
  },

  // delete comment by ID
  async deleteComment(commentID: string, userId: string) {
    const commentToDelete = await commentsRepository.findComment(commentID);
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
    const commentDeleteResult = await commentsRepository.deleteComment(commentID);
    if (commentDeleteResult !== 1) {
      return {
        status: DomainStatusCode.InternalServerError,
        data: null,
        extensions: [{ message: 'Something went wrong.' }],
      };
    }
    return {
      status: DomainStatusCode.Success,
      data: null,
      extensions: [{ message: 'Comment deleted.' }],
    };
  },
};
