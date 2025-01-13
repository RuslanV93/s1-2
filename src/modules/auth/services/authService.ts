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
import { resultObject } from '../../../common/helpers/resultObjectHelpers';

function isSuccess(result: ResultObject<any>): result is ResultObject<string> {
  return result.status === DomainStatusCode.Success && result.data !== null;
}
function hasValidRecoveryCode(user: UserDbType | null): user is UserDbType & {
  passwordInfo: {
    passwordRecoveryCode: string;
    passwordRecoveryCodeExpires: Date;
  };
} {
  return !!(
    user?.passwordInfo?.passwordRecoveryCode &&
    user?.passwordInfo?.passwordRecoveryCodeExpires
  );
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
    if (!user?.passwordInfo.passwordHash) {
      return resultObject.errorResultObject('Unauthorized', {
        message: loginField.includes('@')
          ? 'User not found. Invalid email.'
          : 'User not found. Invalid login',
        field: loginField.includes('@') ? 'email' : 'login',
      });
      // return {
      //   status: DomainStatusCode.Unauthorized,
      //   data: null,
      //   extensions: [
      //     {
      //       message: loginField.includes('@')
      //         ? 'User not found. Invalid email.'
      //         : 'User not found. Invalid login',
      //       field: loginField.includes('@') ? 'email' : 'login',
      //     },
      //   ],
      // };
    }
    // comparing password and pass hash
    const passwordIsMatch = await comparePassword(
      passwordField,
      user.passwordInfo.passwordHash,
    );
    if (!passwordIsMatch) {
      return resultObject.errorResultObject('Unauthorized', {
        message: 'incorrect password',
        field: 'password',
      });
      // return {
      //   status: DomainStatusCode.Unauthorized,
      //   data: null,
      //   extensions: [{ message: 'incorrect password', field: 'password' }],
      // };
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
      passwordInfo: {
        passwordHash,
        passwordRecoveryCode: null,
        passwordRecoveryCodeExpires: null,
      },
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
    const emailSend = await nodemailerService.sendConfirmEmailAdapter(
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
    const emailSendResult = await nodemailerService.sendConfirmEmailAdapter(
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
    const logoutResult = await devicesRepository.deleteDeviceById(deviceId);
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
  async passwordRecovery(email: string) {
    const user: UserDbType | null = await authRepository.findUser(email);
    if (!user) {
      return resultObject.errorResultObject('NotFound', {
        message: 'Incorrect recovery code.',
      });
    }
    const recoveryCode = randomUUID();
    const recoveryCodeExpDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const passwordRecoveryInfoUpdateResult =
      await authRepository.setPasswordRecoveryInfo(
        email,
        recoveryCode,
        recoveryCodeExpDate,
      );
    if (!passwordRecoveryInfoUpdateResult) {
      return resultObject.errorResultObject('InternalServerError', {
        message: 'Something went wrong.',
      });
    }
    const passwordSendResult = await nodemailerService.sendPasswordResetAdapter(
      email,
      user.login,
      recoveryCode,
    );
    if (!passwordSendResult.success) {
      return resultObject.errorResultObject('InternalServerError', {
        message: 'Email sent error. Something went wrong.',
      });
    }

    return resultObject.successResultObject();
  },
  async confirmPasswordRecovery(newPassword: string, recoveryCode: string) {
    const user: UserDbType | null =
      await authRepository.findUserByPasswordConfirmCode(recoveryCode);
    if (!user || !hasValidRecoveryCode(user)) {
      return resultObject.badRequestResultObject({
        message: 'Recovery Code is invalid.',
        field: 'recoveryCode',
      });
    }
    const confirmDate = Date.now();
    if (
      recoveryCode !== user.passwordInfo.passwordRecoveryCode ||
      confirmDate > user.passwordInfo.passwordRecoveryCodeExpires.getTime()
    ) {
      return resultObject.errorResultObject('BadRequest', {
        message: 'Recovery Code does not match.',
      });
    }
    const { passwordHash } = await genHashFunction(newPassword);
    const passwordSaveResult = await authRepository.saveNewPassword(
      user.email,
      passwordHash,
    );
    if (!passwordSaveResult) {
      return resultObject.internalErrorResultObject();
    }
    return resultObject.successResultObject();
  },
};
