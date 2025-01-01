import { comparePassword } from '../../../common/crypto/verifyPassword';
import { authRepository } from '../repositories/authRepository';
import { NewUserType, UserDbType } from '../../users/types/usersTypes';
import { WithId } from 'mongodb';
import { usersRepository } from '../../users/repositories/usersRepository';
import { DomainStatusCode, ResultObject } from '../../../common/types/types';
import { genHashFunction } from '../../../common/crypto/getHash';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns/add';
import { nodemailerService } from '../adapters/sendEmailAdapter';
import { jwtService } from '../../../common/crypto/jwtService';
import { devicesService } from '../../devices/services/devicesService';
import { devicesRepository } from '../../devices/repositories/devicesRepository';

function isSuccess(result: ResultObject<any>): result is ResultObject<string> {
  return result.status === DomainStatusCode.Success && result.data !== null;
}
export const authService = {
  /** checking credentials */
  async loginUser(
    loginField: string,
    passwordField: string,
    ip: string,
    title: string,
  ): Promise<ResultObject<null | Array<string>>> {
    // checking is user exist. getting users pass hash
    const user = await authRepository.getUserByLogin(loginField);
    if (!user?.passwordHash) {
      return {
        status: DomainStatusCode.Unauthorized,
        data: null,
        extensions: [
          {
            message: loginField.includes('@')
              ? 'User not found. Invalid email.'
              : 'User not found. Invalid login',
            field: loginField.includes('@') ? 'email' : 'login',
          },
        ],
      };
    }
    // comparing password and pass hash
    const passwordIsMatch = await comparePassword(passwordField, user.passwordHash);
    if (!passwordIsMatch) {
      return {
        status: DomainStatusCode.Unauthorized,
        data: null,
        extensions: [{ message: 'incorrect password', field: 'password' }],
      };
    }

    // checking user email confirmation
    if (user.emailConfirmation.isConfirmed !== 'confirmed') {
      return {
        status: DomainStatusCode.Unauthorized,
        data: null,
        extensions: [{ message: 'Email is not confirmed', field: 'email' }],
      };
    }

    // Creating new access token
    const accessToken: string = await jwtService.createJWT(user._id.toString());

    // Creating session for login device
    const newDeviceCreationResult: ResultObject<string | null> =
      await devicesService.createDevice(user._id.toString(), ip, title);

    if (!isSuccess(newDeviceCreationResult)) {
      return {
        status: newDeviceCreationResult.status,
        data: null,
        extensions: newDeviceCreationResult.extensions,
      };
    }
    return {
      status: DomainStatusCode.Success,
      data: [accessToken, newDeviceCreationResult.data],
      extensions: [],
    };
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
  async verifyRefreshTokenVersion(deviceId: string, exp: number) {
    const userRefreshTokenVersion =
      await devicesRepository.getDeviceSessionTokenExpDate(deviceId);
    if (userRefreshTokenVersion === undefined) {
      return {
        status: DomainStatusCode.InternalServerError,
        data: null,
        extensions: [{ message: 'User not found. Something went wrong' }],
      };
    }

    if (
      userRefreshTokenVersion === null ||
      userRefreshTokenVersion !== exp.toString()
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
  /** Update access and refresh tokens. Update device sessions fields */
  async updateRefreshToken(userId: string, deviceId: string) {
    const refreshToken = await jwtService.createRefreshJWT(userId, deviceId);
    const refreshTokenPayload =
      await jwtService.getRefreshTokenPayload(refreshToken);
    const updateDeviceSession = await devicesRepository.updateDeviceSession(
      deviceId,
      refreshTokenPayload.exp,
      refreshTokenPayload.iat,
    );
    if (!updateDeviceSession) {
      return {
        status: DomainStatusCode.InternalServerError,
        data: null,
        extensions: [{ message: 'Internal Server Error. Hello' }],
      };
    }
    return {
      status: DomainStatusCode.Success,
      data: refreshToken,
      extensions: [],
    };
  },
  async logout(deviceId: string) {
    const logoutResult = await devicesRepository.deleteDeviceSession(deviceId);
    if (!logoutResult) {
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
