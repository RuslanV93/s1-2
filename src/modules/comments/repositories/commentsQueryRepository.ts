import { CommentsRequestWithQueryType } from '../types/commentsResponseRequestTypes';
import { commentsCollection } from '../../../db/db';
import { commentsMappers } from '../features/commentsMappers';
import { AllCommentsViewType, CommentDbType } from '../types/commentsTypes';
import { ObjectId } from 'mongodb';

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
    console.log(filter);
    const totalCount = await this.getCommentsTotalCount(paginationAndSearchParams);
    const { pageNumber, pageSize, sortBy, sortDirection } = paginationAndSearchParams;
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
  async getCommentById(id: string) {
    const [dbComment] = await commentsCollection
      .find({ _id: new ObjectId(id) })
      .toArray();

    return {
      id: dbComment._id.toString(),
      content: dbComment.content,
      commentatorInfo: {
        userId: dbComment.commentatorInfo.userId.toString(),
        userLogin: dbComment.commentatorInfo.userLogin,
      },
    };
  },
};
