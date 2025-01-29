import { ObjectId } from 'mongodb';
import { NewUserType, UserDbType } from '../types/usersTypes';
import { usersCollection } from '../../../db/db';
import { injectable } from 'inversify';

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

@injectable()
export class UsersRepository {
  async isLoginOrEmailTaken(email: string, login: string) {
    const loginCount = await usersCollection.countDocuments({
      login: login,
    });
    const emailCount = await usersCollection.countDocuments({
      email: email,
    });
    return { loginCount, emailCount };
  }
  // getting existing user
  async getUserById(id: ObjectId) {
    const [user]: Array<UserDbType> = await usersCollection
      .find<UserDbType>({ _id: id })
      .toArray();

    if (user) {
      return user;
    }
    return null;
  }

  // add new user to db and return inserted id
  async addNewUser(newUser: NewUserType): Promise<string | null> {
    const result = await usersCollection.insertOne(newUser);
    if (result.insertedId) {
      return result.insertedId.toString();
    }
    return null;
  }

  //delete existing user by id
  async deleteUser(id: ObjectId): Promise<boolean> {
    const deleteResult = await usersCollection.deleteOne({
      _id: id,
    });
    return deleteResult.deletedCount === 1;
  }
}
