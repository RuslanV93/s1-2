import mongoose from 'mongoose';
import { LikesDbType } from '../types/likesTypes';

const likesSchema = new mongoose.Schema<LikesDbType>({
  status: { type: String, enum: ['none', 'like', 'dislike'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

export const Likes = mongoose.model<LikesDbType>('Likes', likesSchema);
