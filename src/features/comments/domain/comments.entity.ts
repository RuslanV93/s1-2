import mongoose from 'mongoose';
import { CommentatorInfoType, CommentDbType } from '../types/commentsTypes';
import { BLOGGERS_PLATFORM } from '../../../common/variables/variables';

const commentatorInfoSchema = new mongoose.Schema<CommentatorInfoType>(
  {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  { _id: false, versionKey: false },
);
const likesInfoSchema = new mongoose.Schema(
  {
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
  },
  { _id: false, versionKey: false },
);
const commentsSchema = new mongoose.Schema<CommentDbType>(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    commentatorInfo: { type: commentatorInfoSchema, required: true },
    createdAt: { type: String, required: true },
    likesInfo: { type: likesInfoSchema, required: true },
  },
  { collection: BLOGGERS_PLATFORM.comments, versionKey: false },
);

export const Comments = mongoose.model<CommentDbType>('Comments', commentsSchema);
