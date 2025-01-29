import { ObjectId } from 'mongodb';
import { NewPostType, PostDbType, PostForUpdateType } from '../types/postsTypes';
import { injectable } from 'inversify';
import { HydratedDocument } from 'mongoose';
import { PostModel } from '../domain/posts.entity';

@injectable()
export class PostsRepository {
  // getting post by post id
  async getPostById(id: ObjectId) {
    const postById = await PostModel.findOne({ _id: id });
    if (postById) {
      return postById;
    }
    return null;
  }
  //add new post
  async addNewPost(newPost: NewPostType): Promise<string | null> {
    const result = await PostModel.create(newPost);
    if (result._id) {
      return result._id.toString();
    }
    return null;
  }
  // delete existing post by id
  async deletePostById(id: ObjectId): Promise<boolean> {
    const result = await PostModel.deleteOne({
      _id: id,
    });

    return result.deletedCount === 1;
  }

  // update existing post by id
  async updatePostById(
    postId: string,
    updatedPost: PostForUpdateType,
  ): Promise<boolean> {
    const result = await PostModel.updateOne(
      { _id: new ObjectId(postId) },
      { $set: updatedPost },
    );

    return result.modifiedCount === 1;
  }
  async postSave(post: HydratedDocument<PostDbType>): Promise<string> {
    await post.save();
    return post._id.toString();
  }
}
