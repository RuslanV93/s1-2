import { ObjectId } from 'mongodb';
import { CommentDbType, NewCommentType } from '../types/commentsTypes';
import { postsCollection } from '../../../db/db';
import { Comments } from '../domain/comments.entity';

export class CommentsRepository {
  // finding existing post
  async findPost(postId: string): Promise<ObjectId | null> {
    const [post] = await postsCollection
      .find({ _id: new ObjectId(postId) })
      .toArray();
    return post ? post._id : null;
  }

  //find existing comment
  async findComment(commentId: string): Promise<CommentDbType | null> {
    const [comment] = await Comments.find<CommentDbType>({
      _id: new ObjectId(commentId),
    });
    return comment ? comment : null;
  }

  // adding new comment
  async addNewComment(newComment: NewCommentType): Promise<ObjectId | null> {
    const result = await Comments.create(newComment);
    if (!result) {
      return null;
    }
    return result._id;
  }

  //update comment
  async updateComment(
    commentId: string,
    updatedCommentText: string,
  ): Promise<number | null> {
    const result = await Comments.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { content: updatedCommentText } },
    );
    if (!result) {
      return null;
    }
    return result.modifiedCount;
  }

  // delete comment from db
  async deleteComment(commentId: string): Promise<number | null> {
    const deleteResult = await Comments.deleteOne({
      _id: new ObjectId(commentId),
    });

    return deleteResult.deletedCount || null;
  }
}
