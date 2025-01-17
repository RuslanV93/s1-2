import {
  AllCommentsViewType,
  CommentDbType,
  CommentViewType,
  MyLikesStatus,
} from '../types/commentsTypes';
import { CommentsRequestWithQueryType } from '../types/commentsResponseRequestTypes';

export const commentsMappers = {
  commentsToViewModelMapper(
    dbComments: Array<CommentDbType>,
  ): Array<CommentViewType> {
    const comments: CommentViewType[] = dbComments.map((comment) => {
      return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
          userId: comment.commentatorInfo.userId.toString(),
          userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: MyLikesStatus.none,
        },
      };
    });
    return comments;
  },
  commentsToViewTypeWithPageParamsMapper(
    dbComments: Array<CommentDbType>,
    totalCount: number,
    params: CommentsRequestWithQueryType,
  ): AllCommentsViewType {
    const comments: CommentViewType[] = this.commentsToViewModelMapper(dbComments);

    return {
      pagesCount: Math.ceil(totalCount / params.pageSize),
      page: params.pageNumber,
      pageSize: params.pageSize,
      totalCount: totalCount,
      items: comments,
    };
  },
};
