import mongoose from 'mongoose';
import { LikesDbType } from '../types/likesTypes';
import { BLOGGERS_PLATFORM } from '../../../common/variables/variables';

const likesSchema = new mongoose.Schema<LikesDbType>(
  {
    status: { type: String, enum: ['None', 'Like', 'Dislike'], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { collection: BLOGGERS_PLATFORM.likes, versionKey: false },
);

export const Likes = mongoose.model<LikesDbType>('Likes', likesSchema);
