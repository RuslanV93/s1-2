import { getTestUserData, userAgentData } from '../testData/data';
import { req } from './default.e2e.test';
import SETTINGS from '../../src/settings';
import { usersService } from '../../src/features/users/services/usersService';
import { runDb, stopDb } from '../../src/db/db';
import { jwtService } from '../../src/common/crypto/jwtService';
const correctAuthData: string = 'admin:qwerty';
const authData = `Basic ${Buffer.from(correctAuthData).toString('base64')}`;

describe('multi-devices tests', () => {
  const user1 = getTestUserData(1);
  const user2 = getTestUserData(2);
  const user3 = getTestUserData(3);
  //@ts-ignore
  const url: string = SETTINGS.LOCAL_DB_URL;
  let deviceIdToDelete: string;
  let rt: string;
  beforeAll(async () => {
    await runDb(url);
    await usersService.addNewUser(user1.login, user1.email, user1.password);
    await usersService.addNewUser(user2.login, user2.email, user2.password);
    await usersService.addNewUser(user3.login, user3.email, user3.password);
  });
  afterAll(async () => {
    await req.delete('/testing/all-data').set('authorization', authData).expect(204);
    await stopDb();
  });
  it('should login and create new device session', async () => {
    const result1 = await req
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .set('User-Agent', userAgentData.device1)
      .send({ loginOrEmail: user1.login, password: user1.password })
      .expect(200);
    const cookies = result1.headers['set-cookie'] as unknown as string[];
    const refreshToken = cookies
      .find((cookie) => cookie.startsWith('refreshToken='))
      ?.split(';')[0]
      .split('=')[1];
    const devices = await req
      .get(`${SETTINGS.PATH.SECURITY}/devices`)
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(200);
    deviceIdToDelete = devices.body[0].deviceId;
    expect(devices.body.length).toBe(1);
    expect(devices.body[0].title).toBe('Platform: Apple Mac, Browser: Safari');
  });
  it('should login by second and third device. create 2 new session. then delete newest session', async () => {
    const result = await req
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .set('User-Agent', userAgentData.device2)
      .send({ loginOrEmail: user1.login, password: user1.password })
      .expect(200);
    const cookies = result.headers['set-cookie'] as unknown as string[];
    const refreshToken = cookies
      .find((cookie) => cookie.startsWith('refreshToken='))
      ?.split(';')[0]
      .split('=')[1];
    // @ts-ignore
    rt = refreshToken;
    const devices = await req
      .get(`${SETTINGS.PATH.SECURITY}/devices`)
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(200);
    expect(devices.body.length).toBe(2);
    expect(devices.body[1].title).toBe(
      'Platform: Microsoft Windows, Browser: Firefox',
    );
    const result2 = await req
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .set('User-Agent', userAgentData.device3)
      .send({ loginOrEmail: user1.login, password: user1.password })
      .expect(200);
    const devices2 = await req
      .get(`${SETTINGS.PATH.SECURITY}/devices`)
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(200);
    expect(devices2.body.length).toBe(3);
    const deleteResult = await req
      .delete(`${SETTINGS.PATH.SECURITY}/devices/${deviceIdToDelete}`)
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(204);
    const device3 = await req
      .get(`${SETTINGS.PATH.SECURITY}/devices/`)
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect(200);
    expect(device3.body.length).toBe(2);
  });
  it('try delete already deleted device session', async () => {
    await req
      .delete(`${SETTINGS.PATH.SECURITY}/devices/${deviceIdToDelete}`)
      .set('Cookie', `refreshToken=${rt}`)
      .expect(404);
  });
  it('try delete session without login creds. return unauthorized error', async () => {
    await req
      .delete(`${SETTINGS.PATH.SECURITY}/devices/${deviceIdToDelete}`)
      .set('Cookie', `refreshToken=HELLO_WORLD}`)
      .expect(401);
  });
  it("create user2 session. try to delete another user's session.", async () => {
    setTimeout(() => {}, 10000);
    const login = await req
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .set('User-Agent', userAgentData.device2)
      .send({ loginOrEmail: user2.login, password: user2.password })
      .expect(200);
    //first user refreshToken
    const cookies = login.headers['set-cookie'] as unknown as string[];
    //@ts-ignore
    const refreshToken1: string = cookies
      .find((cookie) => cookie.startsWith('refreshToken='))
      ?.split(';')[0]
      .split('=')[1];

    const login2 = await req
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .set('User-Agent', userAgentData.device2)
      .send({ loginOrEmail: user3.login, password: user3.password })
      .expect(200);

    //second user refreshToken
    const cookies2 = login2.headers['set-cookie'] as unknown as string[];
    //@ts-ignore
    const refreshToken2: string = cookies2
      .find((cookie) => cookie.startsWith('refreshToken='))
      ?.split(';')[0]
      .split('=')[1];
    const refreshToken2Payload: any =
      await jwtService.getRefreshTokenPayload(refreshToken2);
    const login2DeviceId = refreshToken2Payload.deviceId;
    await req
      .delete(`${SETTINGS.PATH.SECURITY}/devices/${login2DeviceId}`)
      .set('Cookie', `refreshToken=${refreshToken1}`)
      .expect(403);
  });
});
