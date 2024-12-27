import { describe } from 'node:test';
import { nodemailerService } from '../../src/modules/auth/adapters/sendEmailAdapter';
import { newTestUserForSelfRegistration } from '../testData/data';
import { authService } from '../../src/modules/auth/services/authService';
import { DomainStatusCode } from '../../src/common/types/types';
import { authRepository } from '../../src/modules/auth/repositories/authRepository';
import { req } from '../e2e-tests/default.e2e.test';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { runDb, stopDb } from '../../src/db/db';
import SETTINGS from '../../src/settings';

//@ts-ignore
const uri: string = SETTINGS.LOCAL_DB_URL;
const correctAuthData: string = 'admin:qwerty';
const authData = `Basic ${Buffer.from(correctAuthData).toString('base64')}`;

describe('/auth', () => {
  nodemailerService.sendEmailAdapter = jest
    .fn()
    .mockImplementation(
      (username: string, userEmail: string, confirmationCode: string) => {
        const info = {
          response: 'success',
        };
        return Promise.resolve({ success: true, info: info.response });
      },
    );
  let server: MongoMemoryServer;
  beforeAll(async () => {
    await runDb(uri);
  });
  afterAll(async () => {
    await req.delete('/testing/all-data').set('authorization', authData).expect(204);
    await stopDb();
  });
  it('should register user by correct data', async () => {
    const { login, email, password } = newTestUserForSelfRegistration;
    const result = await authService.userRegistration(login, password, email);
    expect(result.status).toBe(DomainStatusCode.Success);
    const user = await authRepository.findUser(email);
    expect(user!.email).toBe(email);
  });
  it('should resend email confirmation code', async () => {
    const { email } = newTestUserForSelfRegistration;

    const result = await authService.emailResend(email);
    expect(result.status).toBe(DomainStatusCode.Success);
  });
  it('should return error cuz email is incorrect. email confirm code resend', async () => {
    const email = 'ruslan@mail.ru';
    const result = await authService.emailResend(email);
    expect(result.status).toBe(DomainStatusCode.BadRequest);
  });
  it('should confirm email confirm registration. return success', async () => {
    const { email } = newTestUserForSelfRegistration;
    const user = await authRepository.findUser(email);
    const confirmCode = user!.emailConfirmation.confirmationCode;
    const result = await authService.registrationConfirm(confirmCode);
    expect(result.status).toBe(DomainStatusCode.Success);
  });
});
