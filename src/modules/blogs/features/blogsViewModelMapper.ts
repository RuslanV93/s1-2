import { AllBlogsViewType, BlogDbType } from '../../../types/db.type';
import { blogRequestTypeQuery } from '../types/blogsRequestResponseTypes';

export const blogsMappers = {
  async setBlogsToViewModelMapper(
    dbBlogs: Array<BlogDbType>,
    paginationAndSearchParams: blogRequestTypeQuery,
    blogsTotalCount: number,
  ): Promise<AllBlogsViewType> {
    const blogsWithId = dbBlogs.map((blog) => {
      return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      };
    });
    return {
      pagesCount: Math.ceil(blogsTotalCount / paginationAndSearchParams.pageSize),
      page: paginationAndSearchParams.pageNumber,
      pageSize: paginationAndSearchParams.pageSize,
      totalCount: blogsTotalCount,
      items: blogsWithId,
    };
  },
};
