import { db } from '../../../db/db';

import { BLOGGERS_PLATFORM } from '../../../variables/variables';
import { ObjectId, WithId } from 'mongodb';
import {
  BlogViewType,
  NewPostType,
  PostForUpdateType,
  PostViewType,
} from '../../../types/db.type';

export const postsRepository = {
  async getBlogNameById(id: string): Promise<string | null> {
    const blog = await db
      .collection<BlogViewType>(BLOGGERS_PLATFORM.blogs)
      .findOne({ _id: new ObjectId(id) });
    if (blog) {
      return blog.name;
    }
    return null;
  },

  async getPosts(): Promise<Array<WithId<PostViewType>>> {
    return await db
      .collection<PostViewType>(BLOGGERS_PLATFORM.posts)
      .find({})
      .toArray();
  },
  async getPostById(id: string): Promise<WithId<PostViewType> | null> {
    const [postById] = await db
      .collection<PostViewType>(BLOGGERS_PLATFORM.posts)
      .find({ _id: new ObjectId(id) })
      .toArray();
    if (postById) {
      return postById;
    }
    return null;
  },
  async addNewPost(newPost: NewPostType): Promise<WithId<PostViewType> | null> {
    const result = await db
      .collection(BLOGGERS_PLATFORM.posts)
      .insertOne(newPost);
    if (result.insertedId) {
      return await db
        .collection<PostViewType>(BLOGGERS_PLATFORM.posts)
        .findOne({ _id: result.insertedId });
    }
    return null;
  },
  async deletePostById(id: string): Promise<boolean> {
    const result = await db
      .collection(BLOGGERS_PLATFORM.posts)
      .deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  },
  async updatePostById(updatedPost: PostForUpdateType): Promise<boolean> {
    const result = await db
      .collection(BLOGGERS_PLATFORM.posts)
      .updateOne({ _id: new ObjectId(updatedPost.id) }, { $set: updatedPost });

    return result.modifiedCount === 1;
  },
};
