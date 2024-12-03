import { blogsCollection, postsCollection } from '../../../db/db';
import { ObjectId, WithId } from 'mongodb';

import { postsMappers } from '../../posts/features/postsViewModelMapper';
import { PostRequestTypeQuery } from '../../posts/types/postsRequestResponseTypes';
import { BlogForUpdateType, BlogViewType, NewBlogType } from '../types/blogsTypes';
import {
  AllPostsViewType,
  NewPostType,
  PostDbType,
  PostViewType,
} from '../../posts/types/postsTypes';

const createFilter = (searchAndPaginationParams: any, blogId?: string) => {
  const filter: any = {};
  const { search } = searchAndPaginationParams;
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

export const blogsRepository = {
  async getPostsTotalCount(
    searchAndPaginationParams: PostRequestTypeQuery,
  ): Promise<number> {
    const filter = createFilter(searchAndPaginationParams);
    return await postsCollection.countDocuments(filter);
  },

  async getBlogById(_id: ObjectId): Promise<BlogViewType | null> {
    const [blogById] = await blogsCollection.find({ _id: _id }).toArray();
    if (blogById) {
      return {
        id: blogById._id.toString(),
        name: blogById.name,
        description: blogById.description,
        websiteUrl: blogById.websiteUrl,
        createdAt: blogById.createdAt,
        isMembership: blogById.isMembership,
      };
    }
    return null;
  },

  async getPostsByBlogId(
    blogId: string,
    searchAndPaginationParams: any,
  ): Promise<AllPostsViewType> {
    const postsTotalCount = await this.getPostsTotalCount(searchAndPaginationParams);
    const filter: any = createFilter(searchAndPaginationParams, blogId);
    const { pageNumber, pageSize, sortBy, sortDirection } = searchAndPaginationParams;

    const dbPosts: Array<PostDbType> = await postsCollection
      .find<PostDbType>(filter)
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .toArray();
    return await postsMappers.setPostsToViewModelMapper(
      dbPosts,
      searchAndPaginationParams,
      postsTotalCount,
    );
  },

  async addNewPostToBlog(newPost: NewPostType): Promise<ObjectId | null> {
    const result = await postsCollection.insertOne(newPost);
    if (result.insertedId) {
      return result.insertedId;
    }
    return null;
  },

  async addNewBlog(newBlog: NewBlogType): Promise<ObjectId | null> {
    const result = await blogsCollection.insertOne(newBlog);
    if (result.insertedId) {
      return result.insertedId;
    }
    return null;
  },

  async deleteBlogById(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },

  async updateBlogById(updatedBlog: BlogForUpdateType): Promise<boolean> {
    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(updatedBlog.id) },
      { $set: updatedBlog },
    );
    return result.modifiedCount === 1;
  },
};
