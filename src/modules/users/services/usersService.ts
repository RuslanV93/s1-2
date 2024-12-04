import { usersRepository } from '../repositories/usersRepository';
import { UserRequestTypeWithBody } from '../types/usersRequestResponseTypes';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { NewUserType } from '../types/usersTypes';
import { getSaltAndHashFunction } from '../crypto/getHash';

export const usersService = {
  // add new user to DB and return
  async addNewUser(
    req: Request<{}, {}, UserRequestTypeWithBody>,
  ): Promise<string | null> {
    const isLoginOrEmailTaken = await usersRepository.isLoginOrEmailTaken(
      req.body.email,
      req.body.login,
    );

    // Checking is email or login exists
    const errors: { [key: string]: string } = {};
    if (isLoginOrEmailTaken.emailCount) {
      errors.login = 'Login is already taken';
    }
    if (isLoginOrEmailTaken.loginCount) {
      errors.email = 'Email is already taken';
    }
    if (Object.keys(errors).length > 0) {
      throw {
        errorsMessages: Object.keys(errors).map((field) => ({
          field,
          message: errors[field],
        })),
      };
    }

    // getting salt and hash
    const { salt, passwordHash } = await getSaltAndHashFunction(req.body.password);

    // create new user
    const newUser: NewUserType = {
      login: req.body.login,
      email: req.body.email,
      passwordHash: passwordHash,
      salt: salt,
      createdAt: new Date().toISOString(),
    };
    const newUserId: string | null = await usersRepository.addNewUser(newUser);

    // new user add result check
    if (!newUserId) {
      return null;
    }

    return newUserId;
  },

  // delete existing user
  async deleteUser(id: ObjectId): Promise<boolean | null> {
    return await usersRepository.deleteUser(id);
  },
};
