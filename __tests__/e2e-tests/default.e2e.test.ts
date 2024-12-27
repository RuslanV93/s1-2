import SETTINGS from '../../src/settings';
import { agent } from 'supertest';
import { app } from '../../src/app';
import { STATUSES } from '../../src/common/variables/variables';
import { runDb } from '../../src/db/db';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const req = agent(app);
//@ts-ignore
const url: string = SETTINGS.LOCAL_DB_URL;
describe('/', () => {
  let server: MongoMemoryServer;
  beforeAll(async () => {
    server = await MongoMemoryServer.create();
    await runDb(url);
  });
  afterAll(async () => {});
  it('should get app version', async () => {
    const res = await req.get(SETTINGS.PATH.DEFAULT).expect(STATUSES.OK_200);
    expect(res.body).toStrictEqual({ version: 'HELLO!' });
  });
});
