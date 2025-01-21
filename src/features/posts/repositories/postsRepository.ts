import { ObjectId } from 'mongodb';
import { NewPostType, PostDbType, PostForUpdateType } from '../types/postsTypes';
import { postsCollection } from '../../../db/db';

export class PostsRepository {
  // getting post by post id
  async getPostById(id: ObjectId): Promise<PostDbType | null> {
    const [postById] = await postsCollection.find<PostDbType>({ _id: id }).toArray();
    if (postById) {
      return postById;
    }
    return null;
  }
  //add new post
  async addNewPost(newPost: NewPostType): Promise<string | null> {
    const result = await postsCollection.insertOne(newPost);
    if (result.insertedId) {
      return result.insertedId.toString();
    }
    return null;
  }
  // delete existing post by id
  async deletePostById(id: ObjectId): Promise<boolean> {
    const result = await postsCollection.deleteOne({
      _id: id,
    });

    return result.deletedCount === 1;
  }

  // update existing post by id
  async updatePostById(
    postId: string,
    updatedPost: PostForUpdateType,
  ): Promise<boolean> {
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: updatedPost },
    );

    return result.modifiedCount === 1;
  }
}
