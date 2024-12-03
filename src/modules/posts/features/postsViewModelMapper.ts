import { PostRequestTypeQuery } from '../types/postsRequestResponseTypes';
import { AllPostsViewType, PostDbType } from '../types/postsTypes';

export const postsMappers = {
  async setPostsToViewModelMapper(
    posts: Array<PostDbType>,
    searchAndPaginationParams: PostRequestTypeQuery,
    postsTotalCount: number,
  ): Promise<AllPostsViewType> {
    const postsWithId = posts.map((post) => {
      return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId.toString(),
        blogName: post.blogName,
        createdAt: post.createdAt,
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
