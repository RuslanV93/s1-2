import { blogsCollection, postsCollection } from '../../../db/db';
import { ObjectId, WithId } from 'mongodb';
import {
  BlogForUpdateType,
  BlogViewType,
  NewBlogType,
  NewPostType,
  PostViewType,
} from '../../../types/db.type';
import { blogRequestTypeQuery } from '../types/blogsRequestResponseTypes';
const createFilter = (paginationParams: any) => {
  const filter: any = {};
  const { search } = paginationParams;
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  return filter;
};

export const blogsRepository = {
  async getBlogsTotalCount(paginationParams: any) {
    const filter: any = createFilter(paginationParams);
    return await blogsCollection.countDocuments(filter);
  },
  async getBlogsPostsCount(blogId: string) {
    return await postsCollection.countDocuments({ blogId: blogId });
  },
  async getBlogs(
    paginationParams: blogRequestTypeQuery,
  ): Promise<Array<WithId<BlogViewType>>> {
    const filter: any = createFilter(paginationParams);
    const { pageNumber, pageSize, sortBy, sortDirection } = paginationParams;
    return await blogsCollection
      .find(filter)
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .toArray();
  },

  async getBlogById(id: string): Promise<WithId<BlogViewType> | null> {
    const [blogById] = await blogsCollection
      .find({ _id: new ObjectId(id) })
      .toArray();
    if (blogById) {
      return blogById;
    }
    return null;
  },

  async getPostsByBlogId(
    blogId: string,
    paginationParams: any,
  ): Promise<Array<WithId<PostViewType>>> {
    const filter: any = { blogId };
    const { pageNumber, pageSize, sortBy, sortDirection, search } =
      paginationParams;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    return await postsCollection
      .find(filter)
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .toArray();
  },
  async addNewPostToBlog(newPost: NewPostType) {
    const result = await postsCollection.insertOne(newPost);
    if (result.insertedId) {
      return await postsCollection.findOne({ _id: result.insertedId });
    }
    return null;
  },
  async addNewBlog(newBlog: NewBlogType): Promise<WithId<BlogViewType> | null> {
    const result = await blogsCollection.insertOne(newBlog);
    if (result.insertedId) {
      return await blogsCollection.findOne({ _id: result.insertedId });
    }
    return null;
  },
  async deleteBlogById(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },
  async updateBlogById(updatedBlog: BlogForUpdateType) {
    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(updatedBlog.id) },
      { $set: updatedBlog },
    );
    return result.modifiedCount === 1;
  },
};
