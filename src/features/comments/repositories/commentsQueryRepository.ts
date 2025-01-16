import { CommentsRequestWithQueryType } from '../types/commentsResponseRequestTypes';
import { commentsMappers } from '../features/commentsMappers';
import {
  AllCommentsViewType,
  CommentDbType,
  CommentViewType,
  myLikesStatus,
} from '../types/commentsTypes';
import { ObjectId } from 'mongodb';
import { Comments } from '../domain/comments.entity';

const createFilter = (params: CommentsRequestWithQueryType) => {
  const filter: any = {};
  if (params.search) {
    filter.postId = new ObjectId(params.search);
  }
  return filter;
};
export class CommentsQueryRepository {
  // getting commentaries total count
  async getCommentsTotalCount(params: CommentsRequestWithQueryType) {
    const filter = createFilter(params);
    return Comments.countDocuments(filter);
  }

  // getting all comments
  async getComments(
    paginationAndSearchParams: CommentsRequestWithQueryType,
  ): Promise<AllCommentsViewType> {
    const filter = createFilter(paginationAndSearchParams);

    const totalCount = await this.getCommentsTotalCount(paginationAndSearchParams);
    const { pageNumber, pageSize, sortBy, sortDirection } =
      paginationAndSearchParams;
    const dbComments = await Comments.find<CommentDbType>(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .lean();

    return commentsMappers.commentsToViewTypeWithPageParamsMapper(
      dbComments,
      totalCount,
      paginationAndSearchParams,
    );
  }

  // get 1 commentary by comment id
  async getCommentById(id: string): Promise<CommentViewType | null> {
    const dbComment = await Comments.findOne({ _id: new ObjectId(id) }).lean();

    if (!dbComment) {
      return null;
    }
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
        myStatus: myLikesStatus.none,
      },
    };
  }
}
