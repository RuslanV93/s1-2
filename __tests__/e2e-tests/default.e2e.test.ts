import SETTINGS from '../../src/settings';
import { agent } from 'supertest';
import { app } from '../../src/app';
import { STATUSES } from '../../src/common/variables/variables';
import { runDb, stopDb } from '../../src/db/db';

export const req = agent(app);
//@ts-ignore
const url: string = SETTINGS.LOCAL_DB_URL;
describe('/', () => {
  beforeAll(async () => {
    await runDb(url);
  });
  afterAll(async () => {});
  it('should get app version', async () => {
    const res = await req.get(SETTINGS.PATH.DEFAULT).expect(STATUSES.OK_200);
    expect(res.body).toStrictEqual({ version: 'HELLO!' });
  });
});
