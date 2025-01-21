import { CommentsRequestWithQueryType } from '../types/commentsResponseRequestTypes';
import { commentsMappers } from './commentsMappers';
import {
  AllCommentsViewType,
  CommentDbType,
  CommentViewType,
  MyLikesStatus,
} from '../types/commentsTypes';
import { ObjectId } from 'mongodb';
import { Comments } from '../domain/comments.entity';
import { LikesQueryRepository } from '../../likes/repositories/likesQueryRepository';
import { likesQueryRepository } from '../../../infrastructure/compositionRoot';

const createFilter = (params: CommentsRequestWithQueryType) => {
  const filter: any = {};
  if (params.search) {
    filter.postId = new ObjectId(params.search);
  }
  return filter;
};
export class CommentsQueryRepository {
  constructor(protected likesQueryRepository: LikesQueryRepository) {}
  // getting commentaries total count
  async getCommentsTotalCount(params: CommentsRequestWithQueryType) {
    const filter = createFilter(params);
    return Comments.countDocuments(filter);
  }

  // getting all comments
  async getComments(
    paginationAndSearchParams: CommentsRequestWithQueryType,
    userId: string,
  ): Promise<AllCommentsViewType | null> {
    try {
      const filter = createFilter(paginationAndSearchParams);
      const totalCount = await this.getCommentsTotalCount(paginationAndSearchParams);
      const { pageNumber, pageSize, sortBy, sortDirection } =
        paginationAndSearchParams;
      const dbComments = await Comments.find<CommentDbType>(filter)
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(pageSize * (pageNumber - 1))
        .limit(pageSize)
        .lean();
      const commentsIds = dbComments.map((comment) => comment._id);
      const likes = await likesQueryRepository.getLikesStatuses(userId, commentsIds);
      return commentsMappers.commentsToViewTypeWithPageParamsMapper(
        dbComments,
        likes,
        totalCount,
        paginationAndSearchParams,
      );
    } catch (error) {
      return null;
    }
  }

  // get 1 commentary by comment id
  async getCommentById(
    commentId: string,
    userId: string,
  ): Promise<CommentViewType | null> {
    const dbComment: CommentDbType | null = await Comments.findOne({
      _id: new ObjectId(commentId),
    }).lean();

    if (!dbComment) {
      return null;
    }
    const getLikeResult = await this.likesQueryRepository.getLikeStatusFromDb(
      commentId,
      userId,
    );
    return {
      id: dbComment._id.toString(),
      content: dbComment.content,
      commentatorInfo: {
        userId: dbComment.commentatorInfo.userId.toString(),
        userLogin: dbComment.commentatorInfo.userLogin,
      },
      createdAt: dbComment.createdAt,
      likesInfo: {
        likesCount: dbComment.likesInfo.likesCount,
        dislikesCount: dbComment.likesInfo.dislikesCount,
        myStatus: getLikeResult.status ? getLikeResult.status : MyLikesStatus.none,
      },
    };
  }
}
