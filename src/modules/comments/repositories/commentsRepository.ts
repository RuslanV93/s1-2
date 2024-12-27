import { ObjectId } from 'mongodb';
import { CommentDbType, NewCommentType } from '../types/commentsTypes';
import { commentsCollection, postsCollection } from '../../../db/db';

export const commentsRepository = {
  // finding existing post
  async findPost(postId: string): Promise<ObjectId | null> {
    const [post] = await postsCollection
      .find({ _id: new ObjectId(postId) })
      .toArray();
    return post ? post._id : null;
  },

  //find existing comment
  async findComment(commentId: string): Promise<CommentDbType | null> {
    const [comment] = await commentsCollection
      .find<CommentDbType>({ _id: new ObjectId(commentId) })
      .toArray();
    return comment ? comment : null;
  },

  // adding new comment
  async addNewComment(newComment: NewCommentType): Promise<ObjectId | null> {
    const result = await commentsCollection.insertOne(newComment);
    if (!result) {
      return null;
    }
    return result.insertedId;
  },

  //update comment
  async updateComment(
    commentId: string,
    updatedCommentText: string,
  ): Promise<number | null> {
    const result = await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { content: updatedCommentText } },
    );
    if (!result) {
      return null;
    }
    return result.modifiedCount;
  },

  // delete comment from db
  async deleteComment(commentId: string): Promise<number | null> {
    const deleteResult = await commentsCollection.deleteOne({
      _id: new ObjectId(commentId),
    });

    if (!deleteResult) {
      return null;
    }
    return deleteResult.deletedCount;
  },
};
