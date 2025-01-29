import { PostRequestTypeWithBody } from '../types/postsRequestResponseTypes';
import { ObjectId } from 'mongodb';
import { PostForUpdateType } from '../types/postsTypes';
import { PostByBlogRequestTypeBody } from '../../blogs/types/blogsRequestResponseTypes';
import { BlogDbType } from '../../blogs/types/blogsTypes';
import { PostsRepository } from '../repositories/postsRepository';
import { inject, injectable } from 'inversify';
import { PostModel } from '../domain/posts.entity';
import { LikesRepository } from '../../likes/repositories/likesRepository';

// posts bll service methods

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository) protected postsRepository: PostsRepository,
    @inject(LikesRepository) protected likesRepository: LikesRepository,
    @inject(PostModel) protected postModel: typeof PostModel,
  ) {}
  // add new post to DB method
  async addNewPost(
    newPostBody: PostRequestTypeWithBody,
    blogName: string,
  ): Promise<string | null> {
    const newPost = this.postModel.makeInstance(
      newPostBody.title,
      newPostBody.shortDescription,
      newPostBody.content,
      newPostBody.blogId,
      blogName,
    );

    const newPostId = await this.postsRepository.postSave(newPost);
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
    const newPost = this.postModel.makeInstance(
      body.title,
      body.shortDescription,
      body.content,
      blogToAddPost._id.toString(),
      blogToAddPost.name,
    );
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
    await this.likesRepository.deletePostLikeEntity(id);
    return await this.postsRepository.deletePostById(id);
  }
}
