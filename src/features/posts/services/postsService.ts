import { PostRequestTypeWithBody } from '../types/postsRequestResponseTypes';
import { ObjectId } from 'mongodb';
import { NewPostType, PostForUpdateType, PostViewType } from '../types/postsTypes';
import { PostByBlogRequestTypeBody } from '../../blogs/types/blogsRequestResponseTypes';
import { BlogDbType } from '../../blogs/types/blogsTypes';
import { PostsRepository } from '../repositories/postsRepository';
import { postsRepository } from '../../../infrastructure/compositionRoot';

// posts bll service methods

export class PostsService {
  constructor(protected postsRepository: PostsRepository) {}
  // add new post to DB method
  async addNewPost(
    newPostBody: PostRequestTypeWithBody,
    blogName: string,
  ): Promise<string | null> {
    const newPost: NewPostType = {
      title: newPostBody.title,
      shortDescription: newPostBody.shortDescription,
      content: newPostBody.content,
      blogId: new ObjectId(newPostBody.blogId),
      blogName: blogName,
      createdAt: new Date().toISOString(),
    };

    const newPostId = await this.postsRepository.addNewPost(newPost);
    if (!newPostId) {
      return null;
    }

    return newPostId;
  }

  // add new post to existing blog
  async addNewPostToBlog(
    body: PostByBlogRequestTypeBody,
    blogToAddPost: BlogDbType,
  ): Promise<string | null> {
    const newPost: NewPostType = {
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: blogToAddPost._id,
      blogName: blogToAddPost.name,
      createdAt: new Date().toISOString(),
    };
    return await this.postsRepository.addNewPost(newPost);
  }

  // update post fields
  async updatePost(
    updatedBody: PostRequestTypeWithBody,
    postId: string,
    blogName: string,
  ): Promise<boolean> {
    const updatedPost: PostForUpdateType = {
      title: updatedBody.title,
      shortDescription: updatedBody.shortDescription,
      content: updatedBody.content,
      blogId: new ObjectId(updatedBody.blogId),
      blogName: blogName,
    };

    return await this.postsRepository.updatePostById(postId, updatedPost);
  }

  // delete existing post by id
  async deletePostById(id: ObjectId): Promise<boolean> {
    return await this.postsRepository.deletePostById(id);
  }
}
