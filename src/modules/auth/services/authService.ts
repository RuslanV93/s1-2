import { comparePassword } from '../../../common/crypto/verifyPassword';
import { authRepository } from '../repositories/authRepository';
import { NewUserType, UserDbType } from '../../users/types/usersTypes';
import { WithId } from 'mongodb';
import { usersRepository } from '../../users/repositories/usersRepository';
import { DomainStatusCode } from '../../../common/types/types';
import { genHashFunction } from '../../../common/crypto/getHash';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns/add';
import { nodemailerService } from '../adapters/sendEmailAdapter';

export const authService = {
  /** checking credentials */
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
            message: errors[field],
            field,
          }),
        ),
      };
    }
    const passwordIsMatch = await comparePassword(passwordField, user.passwordHash);
    if (!passwordIsMatch) {
      throw {
        errorsMessages: [{ message: 'Incorrect password', field: 'password' }],
      };
    }
    return user;
  },

  /** Add new user by registration. Not added by super admin. */
  async userRegistration(login: string, pass: string, email: string) {
    const user = await usersRepository.isLoginOrEmailTaken(email, login);
    if (user.emailCount) {
      return {
        status: DomainStatusCode.BadRequest,
        extensions: [{ message: 'User already exists.', field: 'email' }],
        data: null,
      };
    } else if (user.loginCount) {
      return {
        status: DomainStatusCode.BadRequest,
        extensions: [{ message: 'User already exists.', field: 'login' }],
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
        emailConfirmationCooldown: null,
      },
      refreshTokenInfo: {
        tokenVersion: null,
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
    const emailSend = await nodemailerService.sendEmailAdapter(
      login,
      email,
      confirmationCode,
    );
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

  /** registration confirm. confirm email sending */
  async registrationConfirm(code: string) {
    const existingUser = await authRepository.findUserByConfirmCode(code);

    const isCodeExpired =
      new Date() > existingUser?.emailConfirmation.expirationDate!;

    const isCodeApplied =
      existingUser?.emailConfirmation.isConfirmed === 'confirmed';
    if (!existingUser || isCodeExpired || isCodeApplied) {
      return {
        status: DomainStatusCode.BadRequest,
        data: null,
        extensions: [
          {
            message: 'Confirmation error. Code is incorrect or already activated.',
            field: 'code',
          },
        ],
      };
    }
    const result: WithId<UserDbType> | null =
      await authRepository.registrationConfirm(code);
    if (!result || result.emailConfirmation.isConfirmed !== 'confirmed') {
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

  /** email resending service */
  async emailResend(email: string) {
    const userExists: UserDbType | null = await authRepository.findUser(email);

    if (!userExists) {
      return {
        status: DomainStatusCode.BadRequest,
        data: null,
        extensions: [{ message: 'User does not exist.', field: 'email' }],
      };
    }
    if (userExists.emailConfirmation.isConfirmed === 'confirmed') {
      return {
        status: DomainStatusCode.BadRequest,
        data: null,
        extensions: [{ message: 'Email already confirmed', field: 'email' }],
      };
    }
    const newExpirationDate: Date = add(new Date(), {
      hours: 1,
    });
    const newConfirmationCode: string = randomUUID();
    const userWithUpdatedEmailConfirmationFields =
      await authRepository.emailConfirmationResendUpdate(
        email,
        newExpirationDate,
        newConfirmationCode,
      );
    if (!userWithUpdatedEmailConfirmationFields) {
      return {
        status: DomainStatusCode.InternalServerError,
        data: null,
        extensions: [{ message: 'Internal Server Error' }],
      };
    }
    const emailSendResult = await nodemailerService.sendEmailAdapter(
      userExists.login,
      email,
      userWithUpdatedEmailConfirmationFields.emailConfirmation.confirmationCode,
    );
    if (!emailSendResult.success) {
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

  /** Getting users refresh token from DB. Verifying by token version. */
  async verifyRefreshTokenVersion(userId: string, tokenVersion: number) {
    const userRefreshTokenVersion =
      await authRepository.getUsersRefreshTokenVersion(userId);
    if (userRefreshTokenVersion === undefined) {
      return {
        status: DomainStatusCode.InternalServerError,
        data: null,
        extensions: [{ message: 'User not found. Something went wrong' }],
      };
    }
    if (
      userRefreshTokenVersion === null ||
      userRefreshTokenVersion !== tokenVersion.toString()
    ) {
      return {
        status: DomainStatusCode.Unauthorized,
        data: null,
        extensions: [
          { message: 'Token not exists or expired.', field: 'refreshToken' },
        ],
      };
    }
    return {
      status: DomainStatusCode.Success,
      data: null,
      extensions: [],
    };
  },
  /** Updating refresh token fields. At the time update version. IF might be more */
  async updateRefreshToken(userId: string, tokenVersion: string | null) {
    const updateRefreshToken = await authRepository.updateRefreshToken(
      userId,
      tokenVersion,
    );
    if (!updateRefreshToken) {
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
