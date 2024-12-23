import SETTINGS from '../../src/settings';
import { agent } from 'supertest';
import { app } from '../../src/app';
import { STATUSES } from '../../src/common/variables/variables';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Database } from '../../src/db/db';
import { awaitDb } from '../jest.setup';

export const req = agent(app);

describe('/', () => {
  beforeAll(async () => {
    await awaitDb(1000);
  });
  afterAll((done) => {
    done();
  });
  it('should get app version', async () => {
    const res = await req.get(SETTINGS.PATH.DEFAULT).expect(STATUSES.OK_200);
    expect(res.body).toStrictEqual({ version: 'HELLO!' });
  });
});
