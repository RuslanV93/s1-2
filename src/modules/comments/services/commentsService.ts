import { CommentsRequestWithBodyType } from '../types/commentsResponseRequestTypes';
import { commentatorInfoType, NewCommentType } from '../types/commentsTypes';
import { commentsRepository } from '../repositories/commentsRepository';
import { commentsRouter } from '../commentsController';
import { ObjectId } from 'mongodb';

enum DomainStatusCode {
  Success = 0,
  PostNotFound = 1,
  Forbidden = 2,
  Unauthorized = 3,
  BadRequest = 4,
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
    const existingPostToAddCommentId = commentsRepository.findPost(postId);
    if (!existingPostToAddCommentId) {
      return {
        status: DomainStatusCode.PostNotFound,
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
};
