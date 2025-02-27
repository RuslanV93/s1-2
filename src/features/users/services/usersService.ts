import { ObjectId } from 'mongodb';
import { NewUserType } from '../types/usersTypes';
import { genHashFunction } from '../../../common/crypto/getHash';
import { randomUUID } from 'node:crypto';
import { inject, injectable } from 'inversify';
import { UsersRepository } from '../repositories/usersRepository';

@injectable()
export class UsersService {
  constructor(@inject(UsersRepository) private usersRepository: UsersRepository) {}
  // add new user to DB and return
  async addNewUser(
    login: string,
    email: string,
    password: string,
  ): Promise<string | null> {
    const isLoginOrEmailTaken = await this.usersRepository.isLoginOrEmailTaken(
      email,
      login,
    );

    // Checking is email or login exists
    const errors: { [key: string]: string } = {};
    if (isLoginOrEmailTaken.loginCount) {
      errors.login = 'Login is already taken';
    }
    if (isLoginOrEmailTaken.emailCount) {
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
    const { passwordHash } = await genHashFunction(password);

    // create new user
    const newUser: NewUserType = {
      login: login,
      email: email,
      passwordInfo: {
        passwordHash: passwordHash,
        passwordRecoveryCode: null,
        passwordRecoveryCodeExpires: null,
      },
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: null,
        isConfirmed: 'confirmed',
        emailConfirmationCooldown: null,
      },
    };
    const newUserId: string | null = await this.usersRepository.addNewUser(newUser);

    // new user add result check
    if (!newUserId) {
      return null;
    }

    return newUserId;
  }

  // delete existing user
  async deleteUser(id: ObjectId): Promise<boolean | null> {
    return await this.usersRepository.deleteUser(id);
  }
}
