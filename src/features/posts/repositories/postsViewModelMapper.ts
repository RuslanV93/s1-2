import { PostRequestTypeQuery } from '../types/postsRequestResponseTypes';
import { AllPostsViewType, PostDbType, PostViewType } from '../types/postsTypes';
import { MyLikesStatus } from '../../comments/types/commentsTypes';
import { PostLikeDbType } from '../../likes/types/likesTypes';

export const postsMappers = {
  async setPostsToViewModelMapper(
    posts: Array<PostDbType>,
    likes: PostLikeDbType[] | null,
    newestLikesMap: Map<string, any[]>,
    searchAndPaginationParams: PostRequestTypeQuery,
    postsTotalCount: number,
  ): Promise<AllPostsViewType> {
    const likesMap = new Map(
      likes?.map((like) => [like.parentId.toString(), like.status]) ?? [],
    );
    const postsWithId: PostViewType[] = posts.map((post) => {
      const postId = post._id.toString();
      const postNewestLikes = newestLikesMap.get(postId) || [];
      return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: post.extendedLikesInfo.likesCount,
          dislikesCount: post.extendedLikesInfo.dislikesCount,
          myStatus: likesMap.get(post._id.toString()) ?? MyLikesStatus.none,
          newestLikes: postNewestLikes.map((like) => {
            return {
              addedAt: like.addedAt,
              userId: like.userId.toString(),
              login: like.login,
            };
          }),
        },
      };
    });

    return {
      pagesCount: Math.ceil(postsTotalCount / searchAndPaginationParams.pageSize),
      page: searchAndPaginationParams.pageNumber,
      pageSize: searchAndPaginationParams.pageSize,
      totalCount: postsTotalCount,
      items: postsWithId,
    };
  },
};
