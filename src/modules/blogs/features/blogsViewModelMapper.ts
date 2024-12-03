import { BlogRequestTypeQuery } from '../types/blogsRequestResponseTypes';
import { AllBlogsViewType, BlogDbType } from '../types/blogsTypes';

export const blogsMappers = {
  async setBlogsToViewModelMapper(
    dbBlogs: Array<BlogDbType>,
    paginationAndSearchParams: BlogRequestTypeQuery,
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
