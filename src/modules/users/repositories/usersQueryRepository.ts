import { UsersSearchAndPaginationType } from '../types/usersRequestResponseTypes';
import { usersMappers } from '../features/usersMappers';
import { AllUsersViewType, UserDbType, UserViewType } from '../types/usersTypes';
import { ObjectId } from 'mongodb';
import { AuthMeViewType } from '../../auth/types/authTypes';
import { usersCollection } from '../../../db/db';

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
  async getUserById(id: string): Promise<UserViewType | null> {
    const [user] = await usersCollection.find({ _id: new ObjectId(id) }).toArray();
    if (user) {
      return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      };
    }
    return null;
  },

  async findMe(userId: string): Promise<AuthMeViewType | null> {
    const [me] = await usersCollection
      .find<UserDbType>({ _id: new ObjectId(userId) })
      .toArray();
    if (!me) {
      return null;
    }
    return {
      email: me.email,
      login: me.login,
      userId: me._id.toString(),
    };
  },

  // getting all users from db
  async getUsers(
    searchAndPaginationParams: UsersSearchAndPaginationType,
  ): Promise<AllUsersViewType> {
    const filter = createFilter(searchAndPaginationParams);
    const usersTotalCount = await this.getUsersTotalCount(searchAndPaginationParams);
    const { pageNumber, pageSize, sortBy, sortDirection } =
      searchAndPaginationParams;
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
