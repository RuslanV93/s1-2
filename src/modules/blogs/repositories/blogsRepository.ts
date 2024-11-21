import { client, db } from '../../../db/db';

import { BLOGGERS_PLATFORM } from '../../../variables/variables';
import { ObjectId, WithId } from 'mongodb';
import {
  BlogForUpdateType,
  BlogViewType,
  NewBlogType,
} from '../../../types/db.type';

export const blogsRepository = {
  async getBlogs(): Promise<Array<WithId<BlogViewType>>> {
    return db
      .collection<BlogViewType>(BLOGGERS_PLATFORM.blogs)
      .find({})
      .toArray();
  },
  async getBlogById(id: string): Promise<WithId<BlogViewType> | null> {
    const [blogById] = await db
      .collection<BlogViewType>(BLOGGERS_PLATFORM.blogs)
      .find({ _id: new ObjectId(id) })
      .toArray();
    if (blogById) {
      return blogById;
    }
    return null;
  },
  async addNewBlog(newBlog: NewBlogType): Promise<WithId<BlogViewType> | null> {
    const result = await db
      .collection(BLOGGERS_PLATFORM.blogs)
      .insertOne(newBlog);
    if (result.insertedId) {
      return await db
        .collection<BlogViewType>(BLOGGERS_PLATFORM.blogs)
        .findOne({ _id: result.insertedId });
    }
    return null;
  },
  async deleteBlogById(id: string): Promise<boolean> {
    const result = await db
      .collection(BLOGGERS_PLATFORM.blogs)
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },
  async updateBlogById(updatedBlog: BlogForUpdateType) {
    const result = await db
      .collection(BLOGGERS_PLATFORM.blogs)
      .updateOne({ _id: new ObjectId(updatedBlog.id) }, { $set: updatedBlog });
    return result.modifiedCount === 1;
  },
};
