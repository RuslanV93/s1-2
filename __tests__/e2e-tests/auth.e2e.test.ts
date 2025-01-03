import { describe } from 'node:test';
import { req } from './default.e2e.test';
import SETTINGS from '../../src/settings';
import { STATUSES } from '../../src/common/variables/variables';
import { runDb, stopDb } from '../../src/db/db';

//@ts-ignore
const uri: string = SETTINGS.LOCAL_DB_URL;

const correctAuthData: string = 'admin:qwerty';
const authData = `Basic ${Buffer.from(correctAuthData).toString('base64')}`;

jest.setTimeout(10000);
describe('/auth', () => {
  let userData = {
    login: 'lg-772034',
    email: 'lg@lg.com',
    password: 'qwerty1',
  };
  let userToken: string;

  beforeAll(async () => {
    await runDb(uri);

    await req
      .post(SETTINGS.PATH.USERS)
      .set('authorization', authData)
      .send(userData)
      .expect(STATUSES.CREATED_201);

    // getting token
    const res = await req
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send({
        loginOrEmail: 'lg-772034',
        password: 'qwerty1',
      })
      .expect(STATUSES.OK_200);
    //token
    userToken = res.body.accessToken;
  });

  afterAll(async () => {
    await req.delete('/testing/all-data').set('authorization', authData).expect(204);
    await stopDb();
  });

  it("shouldn't login by correct data. return status 401", async () => {
    await req
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send({
        loginOrEmail: 'aaa@aa.aa',
        password: 'qwerty1',
      })
      .expect(STATUSES.UNAUTHORIZED_401);
  });
  it('should auth by token', async () => {
    const res = await req
      .get(`${SETTINGS.PATH.AUTH}/me`)
      .set('authorization', `Bearer ${userToken}`)
      .expect(STATUSES.OK_200);
    expect(res.body.email).toBe('lg@lg.com');
    expect(res.body.login).toBe('lg-772034');
  });
  it('should return login error. incorrect data', async () => {
    const res = await req
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send({
        loginOrEmail: 'aaa@aa.qq',
        password: 'qwerty1',
      })
      .expect(STATUSES.UNAUTHORIZED_401);
  });
});
