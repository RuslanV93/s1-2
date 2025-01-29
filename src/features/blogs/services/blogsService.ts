import { BlogRequestTypeBody } from '../types/blogsRequestResponseTypes';
import { ObjectId } from 'mongodb';
import {
  BlogDbType,
  BlogForUpdateType,
  BlogsModelType,
  NewBlogType,
} from '../types/blogsTypes';
import { BlogsRepository } from '../repositories/blogsRepository';
import { inject, injectable } from 'inversify';
import { BlogModel } from '../domain/blogs.entity';

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
    @inject(BlogModel) protected blogModel: BlogsModelType,
  ) {}
  async addNewBlog(body: BlogRequestTypeBody): Promise<string | null> {
    const newBlog = this.blogModel.makeInstance(
      body.name,
      body.description,
      body.websiteUrl,
    );
    return await this.blogsRepository.saveBlog(newBlog);
  }
  async updateBlog(id: ObjectId, newBody: BlogForUpdateType) {
    const updatedBlog: BlogForUpdateType = {
      name: newBody.name,
      description: newBody.description,
      websiteUrl: newBody.websiteUrl,
    };
    return await this.blogsRepository.updateBlogById(id, updatedBlog);
  }
  async deleteBlogById(id: ObjectId): Promise<boolean> {
    return await this.blogsRepository.deleteBlogById(id);
  }
}
