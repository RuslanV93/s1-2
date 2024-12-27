import { describe } from 'node:test';
import { req } from './default.e2e.test';
import SETTINGS from '../../src/settings';
import { STATUSES } from '../../src/common/variables/variables';
import { UserViewType } from '../../src/modules/users/types/usersTypes';
import { runDb, stopDb } from '../../src/db/db';

//@ts-ignore
const uri: string = SETTINGS.LOCAL_DB_URL;
const correctAuthData: string = 'admin:qwerty';
const authData = `Basic ${Buffer.from(correctAuthData).toString('base64')}`;

jest.setTimeout(50000);

describe('/users', () => {
  let userId: string;
  beforeAll(async () => {
    await runDb(uri);
    await req
      .post(SETTINGS.PATH.USERS)
      .set('authorization', authData)
      .send({
        login: 'lg3',
        email: 'lga@lg.com',
        password: 'qwerty1',
      })
      .expect(STATUSES.CREATED_201);

    const resUsers = await req
      .get(SETTINGS.PATH.USERS)
      .set('authorization', authData);

    userId = resUsers.body.items[0].id;
  });
  afterAll(async () => {
    await req.delete('/testing/all-data').set('authorization', authData).expect(204);
    await stopDb();
  });

  it('should get all users', async () => {
    const res = await req
      .get(SETTINGS.PATH.USERS)
      .set('authorization', authData)
      .expect(STATUSES.OK_200);
    expect(Array.isArray(res.body.items)).toBe(true);
    res.body.items.forEach((user: UserViewType) => {
      expect(user).toEqual({
        id: userId,
        login: 'lg3',
        email: 'lga@lg.com',
        createdAt: expect.any(String),
      });
    });
  });

  it('should delete 1 user by id', async () => {
    req
      .delete(`${SETTINGS.PATH.USERS}/${userId}`)
      .set('authorization', authData)
      .expect(STATUSES.NO_CONTENT_204);
  });
  it('should return error cuz user already deleted', async () => {
    req
      .delete(`${SETTINGS.PATH.USERS}/${userId}`)
      .set('authorization', authData)
      .expect(STATUSES.NOT_FOUNT_404);
  });
});
