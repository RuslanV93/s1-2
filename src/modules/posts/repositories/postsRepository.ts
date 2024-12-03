import { postsCollection } from '../../../db/db';
import { ObjectId } from 'mongodb';
import { NewPostType, PostForUpdateType, PostViewType } from '../types/postsTypes';

export const postsRepository = {
  async getPostById(id: ObjectId): Promise<PostViewType | null> {
    const [postById] = await postsCollection.find({ _id: id }).toArray();
    if (postById) {
      return {
        id: postById._id.toString(),
        title: postById.title,
        shortDescription: postById.shortDescription,
        content: postById.content,
        blogId: postById.blogId.toString(),
        blogName: postById.blogName,
        createdAt: postById.createdAt,
      };
    }
    return null;
  },
  async addNewPost(newPost: NewPostType): Promise<ObjectId | null> {
    const result = await postsCollection.insertOne(newPost);
    if (result.insertedId) {
      return result.insertedId;
    }
    return null;
  },
  async deletePostById(id: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  },
  async updatePostById(updatedPost: PostForUpdateType): Promise<boolean> {
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(updatedPost.id) },
      { $set: updatedPost },
    );

    return result.modifiedCount === 1;
  },
};
