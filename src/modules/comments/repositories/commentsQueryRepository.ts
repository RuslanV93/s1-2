import { CommentsRequestWithQueryType } from '../types/commentsResponseRequestTypes';
import { commentsMappers } from '../features/commentsMappers';
import {
  AllCommentsViewType,
  CommentDbType,
  CommentViewType,
} from '../types/commentsTypes';
import { ObjectId } from 'mongodb';
import { commentsCollection } from '../../../db/db';

const createFilter = (params: CommentsRequestWithQueryType) => {
  const filter: any = {};
  if (params.search) {
    filter.postId = new ObjectId(params.search);
  }
  return filter;
};
export const commentsQueryRepository = {
  // getting commentaries total count
  async getCommentsTotalCount(params: CommentsRequestWithQueryType) {
    const filter = createFilter(params);
    return await commentsCollection.countDocuments(filter);
  },

  // getting all comments
  async getComments(
    paginationAndSearchParams: CommentsRequestWithQueryType,
  ): Promise<AllCommentsViewType> {
    const filter = createFilter(paginationAndSearchParams);

    const totalCount = await this.getCommentsTotalCount(paginationAndSearchParams);
    const { pageNumber, pageSize, sortBy, sortDirection } =
      paginationAndSearchParams;
    const dbComments = await commentsCollection
      .find<CommentDbType>(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .toArray();
    return commentsMappers.commentsToViewTypeWithPageParamsMapper(
      dbComments,
      totalCount,
      paginationAndSearchParams,
    );
  },

  // get 1 commentary by comment id
  async getCommentById(id: string): Promise<CommentViewType | null> {
    const [dbComment] = await commentsCollection
      .find({ _id: new ObjectId(id) })
      .toArray();
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
    };
  },
};
