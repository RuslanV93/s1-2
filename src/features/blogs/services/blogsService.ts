import { BlogRequestTypeBody } from '../types/blogsRequestResponseTypes';
import { ObjectId } from 'mongodb';
import { BlogForUpdateType, NewBlogType } from '../types/blogsTypes';
import { blogsRepository } from '../../../infrastructure/compositionRoot';
import { BlogsRepository } from '../repositories/blogsRepository';

export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}
  async addNewBlog(body: BlogRequestTypeBody): Promise<string | null> {
    const newBlog: NewBlogType = {
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return await blogsRepository.addNewBlog(newBlog);
  }
  async updateBlog(id: ObjectId, newBody: BlogForUpdateType) {
    const updatedBlog: BlogForUpdateType = {
      name: newBody.name,
      description: newBody.description,
      websiteUrl: newBody.websiteUrl,
    };
    return await blogsRepository.updateBlogById(id, updatedBlog);
  }
  async deleteBlogById(id: ObjectId): Promise<boolean> {
    return await blogsRepository.deleteBlogById(id);
  }
}
