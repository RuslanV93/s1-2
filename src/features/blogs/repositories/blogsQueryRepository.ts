import { BlogRequestTypeQuery } from '../types/blogsRequestResponseTypes';
import { ObjectId } from 'mongodb';
import { blogsMappers } from './blogsViewModelMapper';
import { AllBlogsViewType, BlogDbType, BlogViewType } from '../types/blogsTypes';
import { blogsCollection } from '../../../db/db';

const createFilter = (paginationAndSearchParams: any, blogId?: ObjectId) => {
  const filter: any = {};
  const { search } = paginationAndSearchParams;
  if (blogId) {
    filter.blogId = blogId;
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }
  return filter;
};

export class BlogsQueryRepository {
  //getting blogs total count method *****
  async getBlogsTotalCount(
    paginationAndSearchParams: BlogRequestTypeQuery,
  ): Promise<number> {
    const filter: any = createFilter(paginationAndSearchParams);

    return await blogsCollection.countDocuments(filter);
  }

  // get all blogs method *******************

  async getBlogs(
    paginationAndSearchParams: BlogRequestTypeQuery,
  ): Promise<AllBlogsViewType> {
    const blogsTotalCount = await this.getBlogsTotalCount(paginationAndSearchParams);

    const filter = createFilter(paginationAndSearchParams);
    const { pageNumber, pageSize, sortBy, sortDirection } =
      paginationAndSearchParams;
    const dbBlogs: Array<BlogDbType> = await blogsCollection
      .find<BlogDbType>(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .toArray();
    return await blogsMappers.setBlogsToViewModelMapper(
      dbBlogs,
      paginationAndSearchParams,
      blogsTotalCount,
    );
  }

  // getting blog bi blog id *******************
  async getBlogById(id: string): Promise<BlogViewType | null> {
    const [dbBlog]: Array<BlogDbType> = await blogsCollection
      .find<BlogDbType>({ _id: new ObjectId(id) })
      .toArray();
    if (!dbBlog) {
      return null;
    }
    return {
      id: dbBlog._id.toString(),
      name: dbBlog.name,
      description: dbBlog.description,
      websiteUrl: dbBlog.websiteUrl,
      createdAt: dbBlog.createdAt,
      isMembership: dbBlog.isMembership,
    };
  }
}
