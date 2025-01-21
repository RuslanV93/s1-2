import { PostRequestTypeQuery } from '../types/postsRequestResponseTypes';
import { ObjectId, WithId } from 'mongodb';
import { postsMappers } from './postsViewModelMapper';
import { AllPostsViewType, PostDbType, PostViewType } from '../types/postsTypes';
import { postsCollection } from '../../../db/db';

// search filter create function **********

const createFilter = (
  searchAndPaginationParams: PostRequestTypeQuery,
  blogId?: ObjectId,
) => {
  const filter: any = {};
  const { search } = searchAndPaginationParams;
  if (blogId) {
    filter.blogId = blogId;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }
  return filter;
};

// query repo posts **********

export class PostsQueryRepository {
  // getting posts total count method **********

  //getting posts total count
  async getPostsTotalCount(
    paginationAndSearchParams: PostRequestTypeQuery,
    blogId?: ObjectId,
  ) {
    const filter: any = blogId
      ? createFilter(paginationAndSearchParams, blogId)
      : createFilter(paginationAndSearchParams);
    return await postsCollection.countDocuments(filter);
  }

  // getting posts by blog id (blogs existing posts) and getting all posts*************

  async getPosts(
    paginationAndSearchParams: PostRequestTypeQuery,
    blogId?: string,
  ): Promise<AllPostsViewType> {
    const postsTotalCount = blogId
      ? await this.getPostsTotalCount(
          paginationAndSearchParams,
          new ObjectId(blogId),
        )
      : await this.getPostsTotalCount(paginationAndSearchParams);

    const filter = blogId
      ? createFilter(paginationAndSearchParams, new ObjectId(blogId))
      : createFilter(paginationAndSearchParams);
    const { pageNumber, pageSize, sortBy, sortDirection } =
      paginationAndSearchParams;
    const dbPosts: Array<WithId<PostDbType>> = await postsCollection
      .find<PostDbType>(filter)
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .toArray();
    return await postsMappers.setPostsToViewModelMapper(
      dbPosts,
      paginationAndSearchParams,
      postsTotalCount,
    );
  }

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
  }
}
