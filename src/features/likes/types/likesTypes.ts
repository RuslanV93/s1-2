import { ObjectId } from 'mongodb';
import { MyLikesStatus } from '../../comments/types/commentsTypes';

export type LikesDbType = {
  _id: ObjectId;
  status: MyLikesStatus;
  userId: ObjectId;
  parentId: ObjectId;
};

export type NewLikesType = {
  status: MyLikesStatus;
  userId: ObjectId;
  parentId: ObjectId;
};
export type LikesRepoResultType = {
  success: boolean;
  status?: MyLikesStatus | null;
  error?: string;
};
