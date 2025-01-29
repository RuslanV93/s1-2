import { Request, Response } from 'express';
import {
  BlogRequestTypeBody,
  BlogRequestTypeParams,
  BlogRequestTypeQuery,
  BlogRequestTypeWithBodyAndParams,
  PostByBlogRequestTypeBody,
} from '../types/blogsRequestResponseTypes';
import { getQueryFromRequest } from '../../../common/helpers/getQueryFromRequest';
import { STATUSES } from '../../../common/variables/variables';
import { BlogDbType, BlogViewType } from '../types/blogsTypes';
import { ObjectId } from 'mongodb';
import { PostRequestTypeWithParams } from '../../posts/types/postsRequestResponseTypes';
import { BlogsRepository } from '../repositories/blogsRepository';
import { BlogsQueryRepository } from '../repositories/blogsQueryRepository';
import { BlogsService } from '../services/blogsService';
import { PostsQueryRepository } from '../../posts/repositories/postsQueryRepository';
import { PostsService } from '../../posts/services/postsService';
import { inject, injectable } from 'inversify';

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
    @inject(BlogsQueryRepository)
    protected blogsQueryRepository: BlogsQueryRepository,
    @inject(BlogsService) protected blogsService: BlogsService,
    @inject(PostsQueryRepository)
    protected postsQueryRepository: PostsQueryRepository,
    @inject(PostsService) protected postsService: PostsService,
  ) {}
  async getBlogs(req: Request<{}, BlogRequestTypeQuery>, res: Response) {
    const paginationAndSearchParams: BlogRequestTypeQuery =
      getQueryFromRequest.getQueryFromRequest(req);

    const blogs = await this.blogsQueryRepository.getBlogs(
      paginationAndSearchParams,
    );
    res.status(STATUSES.OK_200).send(blogs);
  }
  async getBlogsById(req: Request<BlogRequestTypeParams>, res: Response) {
    const id = req.params.id;

    const blog: BlogViewType | null =
      await this.blogsQueryRepository.getBlogById(id);
    if (!blog) {
      res.sendStatus(STATUSES.NOT_FOUND_404);
      return;
    }

    res.status(STATUSES.OK_200).send(blog);
  }
  async addNewBlog(req: Request<{}, {}, BlogRequestTypeBody>, res: Response) {
    const addedBlogId: string | null = await this.blogsService.addNewBlog(req.body);

    if (!addedBlogId) {
      res.sendStatus(STATUSES.BAD_REQUEST_400);
      return;
    }
    const newAddedBlog = await this.blogsQueryRepository.getBlogById(addedBlogId);

    if (!newAddedBlog) {
      res.status(STATUSES.NOT_FOUND_404).send('Blog not found.');
      return;
    }

    res.status(STATUSES.CREATED_201).send(newAddedBlog);
  }
  async deleteBlog(req: Request<BlogRequestTypeParams>, res: Response) {
    // checking is blog exists
    const existingBlog = await this.blogsRepository.getBlogById(
      new ObjectId(req.params.id),
    );
    if (!existingBlog) {
      res.sendStatus(STATUSES.NOT_FOUND_404);
      return;
    }
    // getting delete result (success or not)
    const deleteResult = await this.blogsService.deleteBlogById(existingBlog._id);
    if (!deleteResult) {
      res.status(STATUSES.BAD_REQUEST_400).send('Something went wrong');
      return;
    }
    res.sendStatus(STATUSES.NO_CONTENT_204);
  }
  async updateBlog(req: Request<BlogRequestTypeWithBodyAndParams>, res: Response) {
    const blogForUpdate = await this.blogsRepository.getBlogById(
      new ObjectId(req.params.id),
    );
    if (!blogForUpdate) {
      res.status(STATUSES.NOT_FOUND_404).send('Blog not found. Incorrect blog id');
      return;
    }
    const result = await this.blogsService.updateBlog(
      new ObjectId(req.params.id),
      req.body,
    );
    if (!result) {
      res.status(500).send('Something went wrong.');

      return;
    }
    res.sendStatus(STATUSES.NO_CONTENT_204);
  }
  async getPostsByBlogId(req: Request<PostRequestTypeWithParams>, res: Response) {
    const userId = req.user.id;
    const paginationAndSearchParams: BlogRequestTypeQuery =
      getQueryFromRequest.getQueryFromRequest(req);
    const blog = await this.blogsRepository.getBlogById(new ObjectId(req.params.id));

    if (!blog) {
      res.status(STATUSES.NOT_FOUND_404).send('Blog not found. Incorrect Blog Id.');
      return;
    }
    const postsByBlogId = await this.postsQueryRepository.getPosts(
      paginationAndSearchParams,
      userId,
      req.params.id,
    );

    res.status(STATUSES.OK_200).send(postsByBlogId);
  }
  async addNewPostToBlog(
    req: Request<BlogRequestTypeParams, {}, PostByBlogRequestTypeBody>,
    res: Response,
  ) {
    const userId = req.user.id;
    const blogToAddPost: BlogDbType | null = await this.blogsRepository.getBlogById(
      new ObjectId(req.params.id),
    );

    if (!blogToAddPost) {
      res.sendStatus(STATUSES.NOT_FOUND_404);
      return;
    }
    // Getting new post id after adding to DB
    const newPostId: string | null = await this.postsService.addNewPostToBlog(
      req.body,
      blogToAddPost,
    );
    if (!newPostId) {
      res.sendStatus(STATUSES.BAD_REQUEST_400);
      return;
    }
    // Getting new post to response him
    const newPost = await this.postsQueryRepository.getPostById(newPostId, userId);
    if (!newPost) {
      res.status(STATUSES.NOT_FOUND_404).send('Post not found.');
    }
    res.status(STATUSES.CREATED_201).send(newPost);
  }
}
