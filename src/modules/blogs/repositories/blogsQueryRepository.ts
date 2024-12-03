import { BlogRequestTypeQuery } from '../types/blogsRequestResponseTypes';
import { blogsCollection, postsCollection } from '../../../db/db';
import { ObjectId, WithId } from 'mongodb';
import { blogsMappers } from '../features/blogsViewModelMapper';
import { postsMappers } from '../../posts/features/postsViewModelMapper';
import { PostRequestTypeQuery } from '../../posts/types/postsRequestResponseTypes';
import { AllBlogsViewType, BlogDbType, BlogViewType } from '../types/blogsTypes';
import { AllPostsViewType, PostDbType } from '../../posts/types/postsTypes';

const createFilter = (paginationAndSearchParams: any, blogId?: ObjectId) => {
  const filter: any = {};
  const { search } = paginationAndSearchParams;
  if (blogId) {
    filter.blogId = blogId;
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }
  return filter;
};

export const blogsQueryRepository = {
  //getting blogs total count method *****
  async getBlogsTotalCount(
    paginationAndSearchParams: BlogRequestTypeQuery,
  ): Promise<number> {
    const filter: any = createFilter(paginationAndSearchParams);

    return await blogsCollection.countDocuments(filter);
  },

  //getting posts total count
  async getPostsTotalCount(
    paginationAndSearchParams: PostRequestTypeQuery,
    blogId: ObjectId,
  ) {
    const filter: any = createFilter(paginationAndSearchParams, blogId);
    return await postsCollection.countDocuments(filter);
  },

  // get all blogs method *******************

  async getBlogs(
    paginationAndSearchParams: BlogRequestTypeQuery,
  ): Promise<AllBlogsViewType> {
    const blogsTotalCount = await this.getBlogsTotalCount(paginationAndSearchParams);

    const filter = createFilter(paginationAndSearchParams);
    const { pageNumber, pageSize, sortBy, sortDirection } = paginationAndSearchParams;
    const dbBlogs: Array<BlogDbType> = await blogsCollection
      .find<BlogDbType>(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .toArray();
    return await blogsMappers.setBlogsToViewModelMapper(
      dbBlogs,
      paginationAndSearchParams,
      blogsTotalCount,
    );
  },

  // getting blog bi blog id *******************
  async getBlogById(id: string): Promise<BlogViewType | null> {
    const [dbBlog]: Array<BlogDbType> = await blogsCollection
      .find<BlogDbType>({ _id: new ObjectId(id) })
      .toArray();
    if (!dbBlog) {
      return null;
    }
    return {
      id: dbBlog._id.toString(),
      name: dbBlog.name,
      description: dbBlog.description,
      websiteUrl: dbBlog.websiteUrl,
      createdAt: dbBlog.createdAt,
      isMembership: dbBlog.isMembership,
    };
  },

  // getting posts by blog id (blogs existing posts) *******************
  async getPostsByBlogId(
    blogId: ObjectId,
    paginationAndSearchParams: BlogRequestTypeQuery,
  ): Promise<AllPostsViewType> {
    const postsTotalCount = await this.getPostsTotalCount(
      paginationAndSearchParams,
      blogId,
    );
    const filter = createFilter(paginationAndSearchParams, blogId);
    const { pageNumber, pageSize, sortBy, sortDirection } = paginationAndSearchParams;
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
  },
};