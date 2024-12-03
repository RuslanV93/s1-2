import { postsCollection } from '../../../db/db';
import { PostRequestTypeQuery } from '../types/postsRequestResponseTypes';
import { ObjectId, WithId } from 'mongodb';
import { postsMappers } from '../features/postsViewModelMapper';
import { AllPostsViewType, PostDbType, PostViewType } from '../types/postsTypes';

// search filter create function **********

const createFilter = (searchAndPaginationParams: PostRequestTypeQuery) => {
  const filter: any = {};
  const { search } = searchAndPaginationParams;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }
  return filter;
};

// query repo posts **********

export const postsQueryRepository = {
  // getting posts total count method **********

  async getPostsTotalCount(
    searchAndPaginationParams: PostRequestTypeQuery,
  ): Promise<number> {
    const filter = createFilter(searchAndPaginationParams);
    return await postsCollection.countDocuments(filter);
  },

  // mapper **********

  //get all posts method **********

  async getPosts(searchAndPaginationParams: PostRequestTypeQuery): Promise<any> {
    const postsTotalCount = await this.getPostsTotalCount(searchAndPaginationParams);
    const filter = createFilter(searchAndPaginationParams);
    const { pageNumber, pageSize, sortBy, sortDirection, search } =
      searchAndPaginationParams;

    const dbPosts: Array<WithId<PostDbType>> = await postsCollection
      .find<PostDbType>(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .toArray();
    return await postsMappers.setPostsToViewModelMapper(
      dbPosts,
      searchAndPaginationParams,
      postsTotalCount,
    );
  },

  //get post by id method **********

  async getPostById(id: string): Promise<PostViewType | null> {
    const [dbPost]: Array<WithId<PostDbType>> = await postsCollection
      .find<PostDbType>({ _id: new ObjectId(id) })
      .toArray();
    if (!dbPost) {
      return null;
    }
    return {
      id: dbPost._id.toString(),
      title: dbPost.title,
      shortDescription: dbPost.shortDescription,
      content: dbPost.content,
      blogId: dbPost.blogId.toString(),
      blogName: dbPost.blogName,
      createdAt: dbPost.createdAt,
    };
  },
};
