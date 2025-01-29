import mongoose, { HydratedDocument, Model } from 'mongoose';
import { BlogDbType, BlogsModelType } from '../types/blogsTypes';
import { BLOGGERS_PLATFORM } from '../../../common/variables/variables';

const BlogSchema = new mongoose.Schema<BlogDbType>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, default: false },
  },
  {
    collection: BLOGGERS_PLATFORM.blogs,
    optimisticConcurrency: true,
  },
);

BlogSchema.static(
  'makeInstance',
  function makeInstance(
    name: string,
    description: string,
    websiteUrl: string,
  ): HydratedDocument<BlogDbType> {
    return new this({
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    });
  },
);
export const BlogModel = mongoose.model<BlogDbType, BlogsModelType>(
  'Blogs',
  BlogSchema,
);
