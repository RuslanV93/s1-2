import SETTINGS from '../src/settings';
import { agent } from 'supertest';
import { app } from '../src/app';
import { STATUSES } from '../src/variables/variables';

export const req = agent(app);

describe('/', () => {
  afterAll((done) => {
    done();
  });
  it('should get app version', async () => {
    const res = await req.get(SETTINGS.PATH.DEFAULT).expect(STATUSES.OK_200);
    expect(res.body).toStrictEqual({ version: 'HELLO!' });
  });
});
