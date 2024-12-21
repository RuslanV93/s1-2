import SETTINGS from '../../src/settings';
import { agent } from 'supertest';
import { app } from '../../src/app';
import { STATUSES } from '../../src/common/variables/variables';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Database } from '../../src/db/db';

export const req = agent(app);

describe('/', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
  });
  afterAll((done) => {
    done();
  });
  it('should get app version', async () => {
    const res = await req.get(SETTINGS.PATH.DEFAULT).expect(STATUSES.OK_200);
    expect(res.body).toStrictEqual({ version: 'HELLO!' });
  });
});
