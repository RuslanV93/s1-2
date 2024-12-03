import { usersCollection } from '../../../db/db';
import { UsersSearchAndPaginationType } from '../types/usersRequestResponseTypes';
import { usersMappers } from '../features/usersMappers';
import { AllUsersViewType, UserDbType } from '../types/usersTypes';

// creating filter for search
const createFilter = (searchAndPaginationParams: UsersSearchAndPaginationType) => {
  const filter: any = {};
  const { searchLoginTerm, searchEmailTerm } = searchAndPaginationParams;
  if (searchLoginTerm || searchEmailTerm) {
    filter.$or = [];
    if (searchLoginTerm) {
      filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
    }
    if (searchEmailTerm) {
      filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    }
  }
  return filter;
};

export const usersQueryRepository = {
  async getUsersTotalCount(searchAndPaginationParams: UsersSearchAndPaginationType) {
    const filter = createFilter(searchAndPaginationParams);
    return await usersCollection.countDocuments(filter);
  },

  // getting all users from db
  async getUsers(
    searchAndPaginationParams: UsersSearchAndPaginationType,
  ): Promise<AllUsersViewType> {
    const filter = createFilter(searchAndPaginationParams);
    const usersTotalCount = await this.getUsersTotalCount(searchAndPaginationParams);
    const { pageNumber, pageSize, sortBy, sortDirection } = searchAndPaginationParams;
    const dbUsers = await usersCollection
      .find<UserDbType>(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .toArray();
    return await usersMappers.setUsersToViewModelMapper(
      dbUsers,
      searchAndPaginationParams,
      usersTotalCount,
    );
  },
};
