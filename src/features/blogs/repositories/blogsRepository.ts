import { ObjectId } from 'mongodb';
import { BlogDbType, BlogForUpdateType, NewBlogType } from '../types/blogsTypes';
import { blogsCollection } from '../../../db/db';
import { injectable } from 'inversify';
import { HydratedDocument } from 'mongoose';

@injectable()
export class BlogsRepository {
  async getBlogById(_id: ObjectId): Promise<BlogDbType | null> {
    const [blogById] = await blogsCollection
      .find<BlogDbType>({ _id: _id })
      .toArray();
    if (blogById) {
      return blogById;
    }
    return null;
  }

  async addNewBlog(newBlog: NewBlogType): Promise<string | null> {
    const result = await blogsCollection.insertOne(newBlog);
    if (result.insertedId) {
      return result.insertedId.toString();
    }
    return null;
  }

  async deleteBlogById(id: ObjectId): Promise<boolean> {
    const result = await blogsCollection.deleteOne({
      _id: id,
    });
    return result.deletedCount === 1;
  }
  async updateBlogById(
    blogId: ObjectId,
    updatedBlog: BlogForUpdateType,
  ): Promise<boolean> {
    const result = await blogsCollection.updateOne(
      { _id: blogId },
      { $set: updatedBlog },
    );
    return result.modifiedCount === 1;
  }
  async saveBlog(blog: HydratedDocument<BlogDbType>): Promise<string> {
    await blog.save();
    return blog._id.toString();
  }
}
