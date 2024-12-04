import { blogsCollection, postsCollection } from '../../../db/db';
import { ObjectId, WithId } from 'mongodb';

import { postsMappers } from '../../posts/features/postsViewModelMapper';
import { PostRequestTypeQuery } from '../../posts/types/postsRequestResponseTypes';
import {
  BlogDbType,
  BlogForUpdateType,
  BlogViewType,
  NewBlogType,
} from '../types/blogsTypes';
import {
  AllPostsViewType,
  NewPostType,
  PostDbType,
  PostViewType,
} from '../../posts/types/postsTypes';

export const blogsRepository = {
  async getBlogById(_id: ObjectId): Promise<BlogDbType | null> {
    const [blogById] = await blogsCollection.find<BlogDbType>({ _id: _id }).toArray();
    if (blogById) {
      return blogById;
    }
    return null;
  },

  async addNewPostToBlog(newPost: NewPostType): Promise<string | null> {
    const result = await postsCollection.insertOne(newPost);
    if (result.insertedId) {
      return result.insertedId.toString();
    }
    return null;
  },

  async addNewBlog(newBlog: NewBlogType): Promise<string | null> {
    const result = await blogsCollection.insertOne(newBlog);
    if (result.insertedId) {
      return result.insertedId.toString();
    }
    return null;
  },

  async deleteBlogById(id: ObjectId): Promise<boolean> {
    const result = await blogsCollection.deleteOne({ _id: id });
    return result.deletedCount === 1;
  },

  async updateBlogById(
    blogId: ObjectId,
    updatedBlog: BlogForUpdateType,
  ): Promise<boolean> {
    const result = await blogsCollection.updateOne(
      { _id: blogId },
      { $set: updatedBlog },
    );
    return result.modifiedCount === 1;
  },
};
