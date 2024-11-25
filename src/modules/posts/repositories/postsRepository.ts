import { postsCollection } from '../../../db/db';
import { ObjectId, WithId } from 'mongodb';
import {
  NewPostType,
  PostForUpdateType,
  PostViewType,
} from '../../../types/db.type';
const createFilter = (paginationParams: any) => {
  const filter: any = {};
  const { search } = paginationParams;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }
  return filter;
};

export const postsRepository = {
  async getPostsTotalCount(paginationParams: any) {
    const filter = createFilter(paginationParams);
    return await postsCollection.countDocuments(filter);
  },
  async getPosts(paginationParams: any): Promise<Array<WithId<PostViewType>>> {
    const filter: any = createFilter(paginationParams);
    const { pageNumber, pageSize, sortBy, sortDirection, search } =
      paginationParams;

    return await postsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .toArray();
  },
  async getPostById(id: string): Promise<WithId<PostViewType> | null> {
    const [postById] = await postsCollection
      .find({ _id: new ObjectId(id) })
      .toArray();
    if (postById) {
      return postById;
    }
    return null;
  },
  async addNewPost(newPost: NewPostType): Promise<WithId<PostViewType> | null> {
    const result = await postsCollection.insertOne(newPost);
    if (result.insertedId) {
      return await postsCollection.findOne({ _id: result.insertedId });
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
