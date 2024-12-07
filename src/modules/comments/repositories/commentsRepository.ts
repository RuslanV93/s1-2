import { commentsCollection, postsCollection } from '../../../db/db';
import { ObjectId } from 'mongodb';
import { NewCommentType } from '../types/commentsTypes';

export const commentsRepository = {
  // finding existing post
  async findPost(postId: string): Promise<ObjectId | null> {
    const [post] = await postsCollection.find({ _id: new ObjectId(postId) }).toArray();
    return post ? post._id : null;
  },

  // adding new comment
  async addNewComment(newComment: NewCommentType): Promise<ObjectId | null> {
    const result = await commentsCollection.insertOne(newComment);
    if (!result) {
      return null;
    }
    return result.insertedId;
  },
};
