import { ObjectId } from 'mongodb';
import { usersCollection } from '../../../db/db';
import { NewUserType, UserDbType } from '../types/usersTypes';

const createFilter = (email: string, login: string) => {
  const filter: any = {};
  if (login || email) {
    filter.$or = [];
    if (login) {
      filter.$or.push({ login: login });
    }
    if (email) {
      filter.$or.push({ email: email });
    }
  }
  return filter;
};
export const usersRepository = {
  async isLoginOrEmailTaken(email: string, login: string) {
    const loginCount = await usersCollection.countDocuments({ login: login });
    const emailCount = await usersCollection.countDocuments({ email: email });
    return { loginCount, emailCount };
  },
  // getting existing user
  async getUserById(id: ObjectId) {
    const [user]: Array<UserDbType> = await usersCollection
      .find<UserDbType>({ _id: id })
      .toArray();

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

  // add new user to db and return inserted id
  async addNewUser(newUser: NewUserType) {
    const result = await usersCollection.insertOne(newUser);

    if (result.insertedId) {
      return result.insertedId;
    }
    return null;
  },

  //delete existing user by id
  async deleteUser(id: ObjectId): Promise<boolean> {
    const deleteResult = await usersCollection.deleteOne({ _id: id });
    return deleteResult.deletedCount === 1;
  },
};