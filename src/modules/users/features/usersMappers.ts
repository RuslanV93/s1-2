import { UsersSearchAndPaginationType } from '../types/usersRequestResponseTypes';
import { UserDbType } from '../types/usersTypes';

export const usersMappers = {
  async setUsersToViewModelMapper(
    dbUsers: Array<UserDbType>,
    searchAndPaginationParams: UsersSearchAndPaginationType,
    usersTotalCount: number,
  ) {
    const usersWithId = dbUsers.map((user) => {
      return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      };
    });
    return {
      pagesCount: Math.ceil(usersTotalCount / searchAndPaginationParams.pageSize),
      page: searchAndPaginationParams.pageNumber,
      pageSize: searchAndPaginationParams.pageSize,
      totalCount: usersTotalCount,
      items: usersWithId,
    };
  },
};
