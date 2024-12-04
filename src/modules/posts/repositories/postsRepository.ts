import { postsCollection } from '../../../db/db';
import { ObjectId } from 'mongodb';
import {
  NewPostType,
  PostDbType,
  PostForUpdateType,
  PostViewType,
} from '../types/postsTypes';

export const postsRepository = {
  async getPostById(id: ObjectId): Promise<PostDbType | null> {
    const [postById] = await postsCollection.find<PostDbType>({ _id: id }).toArray();
    if (postById) {
      return postById;
    }
    return null;
  },
  async addNewPost(newPost: NewPostType): Promise<string | null> {
    const result = await postsCollection.insertOne(newPost);
    if (result.insertedId) {
      return result.insertedId.toString();
    }
    return null;
  },
  async deletePostById(id: ObjectId): Promise<boolean> {
    const result = await postsCollection.deleteOne({ _id: id });

    return result.deletedCount === 1;
  },
  async updatePostById(postId: string, updatedPost: PostForUpdateType): Promise<boolean> {
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: updatedPost },
    );

    return result.modifiedCount === 1;
  },
};
