import { comparePassword } from '../../../common/crypto/verifyPassword';
import { authRepository } from '../repositories/authRepository';
import { NewUserType, UserDbType } from '../../users/types/usersTypes';
import settings from '../../../settings';
import { ObjectId, WithId } from 'mongodb';
import { usersRepository } from '../../users/repositories/usersRepository';
import { DomainStatusCode } from '../../../common/types/types';
import { genHashFunction } from '../../../common/crypto/getHash';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns/add';
import { sendEmailAdapter } from '../adapters/sendEmailAdapter';

export const authService = {
  //checking credentials
  async loginUser(loginField: string, passwordField: string): Promise<UserDbType> {
    const user = await authRepository.getHash(loginField);

    if (!user?.passwordHash) {
      const errors: { [key: string]: string } = {};
      if (loginField.includes('@')) {
        errors.email = 'User not found. Invalid email.';
      } else {
        errors.login = 'User not found. Invalid login.';
      }
      throw {
        errorsMessages: Object.keys(errors).map(
          (field): { field: string; message: string } => ({
            field,
            message: errors[field],
          }),
        ),
      };
    }
    const passwordIsMatch = await comparePassword(passwordField, user.passwordHash);
    if (!passwordIsMatch) {
      throw {
        errorsMessages: [{ field: 'password', message: 'Incorrect password' }],
      };
    }
    return user;
  },
  // Add new user by registration. Not added by super admin.
  async userRegistration(login: string, pass: string, email: string) {
    const user = await usersRepository.isLoginOrEmailTaken(email, login);
    if (user.emailCount || user.loginCount) {
      return {
        status: DomainStatusCode.BadRequest,
        extensions: [{ field: 'loginOrEmail', message: 'User already exists.' }],
        data: null,
      };
    }

    // getting pass hash
    const { passwordHash } = await genHashFunction(pass);

    // creating new user
    const newRegisteredUser: NewUserType = {
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: 'unconfirmed',
      },
    };
    const result = await usersRepository.addNewUser(newRegisteredUser);
    if (!result) {
      return {
        status: DomainStatusCode.InternalServerError,
        data: null,
        extensions: [{ message: 'Internal Server Error.' }],
      };
    }
    const confirmationCode = newRegisteredUser.emailConfirmation.confirmationCode;
    const emailSend = await sendEmailAdapter(login, email, confirmationCode);
    if (!emailSend.success) {
      return {
        status: DomainStatusCode.InternalServerError,
        data: null,
        extensions: [{ message: emailSend.error }],
      };
    }

    return {
      status: DomainStatusCode.Success,
      data: null,
      extensions: [],
    };
  },

  async registrationConfirm(code: string) {
    const existingUser = await authRepository.findUserByConfirmCode(code);

    const isCodeExpired = new Date() > existingUser?.emailConfirmation.expirationDate!;

    const isCodeApplied = existingUser?.emailConfirmation.isConfirmed === 'confirmed';
    if (!existingUser || isCodeExpired || isCodeApplied) {
      return {
        status: DomainStatusCode.BadRequest,
        data: null,
        extensions: [
          {
            message: 'Confirmation error. Code is incorrect',
            field: 'Confirmation Code',
          },
        ],
      };
    }
    const result: WithId<UserDbType> | null =
      await authRepository.registrationConfirm(code);
    if (!result || result.emailConfirmation.isConfirmed !== 'confirmed') {
      console.log(result);
      return {
        status: DomainStatusCode.InternalServerError,
        data: null,
        extensions: [{ message: 'Internal Server Error' }],
      };
    }
    return {
      status: DomainStatusCode.Success,
      data: null,
      extensions: [],
    };
  },
};
