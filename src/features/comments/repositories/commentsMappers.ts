import {
  AllCommentsViewType,
  CommentDbType,
  CommentViewType,
  MyLikesStatus,
} from '../types/commentsTypes';
import { CommentsRequestWithQueryType } from '../types/commentsResponseRequestTypes';
import { CommentLikesDbType } from '../../likes/types/likesTypes';

export const commentsMappers = {
  commentsToViewModelMapper(
    dbComments: Array<CommentDbType>,
    likes: CommentLikesDbType[] | null,
  ): Array<CommentViewType> {
    const likesMap = new Map(
      likes?.map((like) => [like.parentId.toString(), like.status]) ?? [],
    );
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
          likesCount: comment.likesInfo.likesCount || 0,
          dislikesCount: comment.likesInfo.dislikesCount || 0,
          myStatus: likesMap.get(comment._id.toString()) ?? MyLikesStatus.none,
        },
      };
    });
    return comments;
  },
  commentsToViewTypeWithPageParamsMapper(
    dbComments: Array<CommentDbType>,
    likes: Array<CommentLikesDbType> | null,
    totalCount: number,
    params: CommentsRequestWithQueryType,
  ): AllCommentsViewType {
    const comments: CommentViewType[] = this.commentsToViewModelMapper(
      dbComments,
      likes,
    );

    return {
      pagesCount: Math.ceil(totalCount / params.pageSize),
      page: params.pageNumber,
      pageSize: params.pageSize,
      totalCount: totalCount,
      items: comments,
    };
  },
};
