import { AllPostsViewType, PostDbType } from '../../../types/db.type';
import { postRequestTypeQuery } from '../types/postsRequestResponseTypes';

export const postsMappers = {
  async setPostsToViewModelMapper(
    posts: Array<PostDbType>,
    searchAndPaginationParams: postRequestTypeQuery,
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
