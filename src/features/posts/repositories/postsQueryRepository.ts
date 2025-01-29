import { PostRequestTypeQuery } from '../types/postsRequestResponseTypes';
import { ObjectId, WithId } from 'mongodb';
import { postsMappers } from './postsViewModelMapper';
import { AllPostsViewType, PostDbType, PostViewType } from '../types/postsTypes';
import { postsCollection } from '../../../db/db';
import { inject, injectable } from 'inversify';
import { PostModel } from '../domain/posts.entity';
import { LikesQueryRepository } from '../../likes/repositories/likesQueryRepository';
import { MyLikesStatus } from '../../comments/types/commentsTypes';

// search filter create function **********

const createFilter = (
  searchAndPaginationParams: PostRequestTypeQuery,
  blogId?: ObjectId,
) => {
  const filter: any = {};
  const { search } = searchAndPaginationParams;
  if (blogId) {
    filter.blogId = blogId;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }
  return filter;
};

@injectable()
export class PostsQueryRepository {
  constructor(
    @inject(LikesQueryRepository)
    protected likesQueryRepository: LikesQueryRepository,
  ) {}
  //getting posts total count
  async getPostsTotalCount(
    paginationAndSearchParams: PostRequestTypeQuery,
    blogId?: ObjectId,
  ) {
    const filter: any = blogId
      ? createFilter(paginationAndSearchParams, blogId)
      : createFilter(paginationAndSearchParams);
    return await postsCollection.countDocuments(filter);
  }

  // getting posts by blog id (blogs existing posts) and getting all posts*************

  async getPosts(
    paginationAndSearchParams: PostRequestTypeQuery,
    userId: string,
    blogId?: string,
  ): Promise<AllPostsViewType> {
    const postsTotalCount = blogId
      ? await this.getPostsTotalCount(
          paginationAndSearchParams,
          new ObjectId(blogId),
        )
      : await this.getPostsTotalCount(paginationAndSearchParams);

    const filter = blogId
      ? createFilter(paginationAndSearchParams, new ObjectId(blogId))
      : createFilter(paginationAndSearchParams);
    const { pageNumber, pageSize, sortBy, sortDirection } =
      paginationAndSearchParams;
    const dbPosts: Array<WithId<PostDbType>> = await PostModel.find<PostDbType>(
      filter,
    )
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 });
    const postsIds: ObjectId[] = dbPosts.map((post) => post._id);
    const likes = await this.likesQueryRepository.getPostLikesStatuses(
      userId,
      postsIds,
    );
    const newestLikes = await this.likesQueryRepository.getPostNewestLike(postsIds);
    return await postsMappers.setPostsToViewModelMapper(
      dbPosts,
      likes,
      newestLikes,
      paginationAndSearchParams,
      postsTotalCount,
    );
  }

  //get post by id method **********

  async getPostById(id: string, userId: string): Promise<PostViewType | null> {
    const [dbPost]: Array<WithId<PostDbType>> = await PostModel.find<PostDbType>({
      _id: new ObjectId(id),
    });
    if (!dbPost) {
      return null;
    }
    const likeResult = await this.likesQueryRepository.getPostLikesStatus(
      id,
      userId,
    );
    const newestLikesMap = await this.likesQueryRepository.getPostNewestLike([
      new ObjectId(id),
    ]);
    console.log(newestLikesMap);
    const postNewestLikes = newestLikesMap.get(id) || [];
    return {
      id: dbPost._id.toString(),
      title: dbPost.title,
      shortDescription: dbPost.shortDescription,
      content: dbPost.content,
      blogId: dbPost.blogId.toString(),
      blogName: dbPost.blogName,
      createdAt: dbPost.createdAt,
      extendedLikesInfo: {
        likesCount: dbPost.extendedLikesInfo.likesCount,
        dislikesCount: dbPost.extendedLikesInfo.dislikesCount,
        myStatus: likeResult.status ? likeResult.status : MyLikesStatus.none,
        newestLikes: postNewestLikes.map((like: any) => {
          return {
            addedAt: like.addedAt.toISOString(),
            userId: like.userId.toString(),
            login: like.login,
          };
        }),
      },
    };
  }
}
