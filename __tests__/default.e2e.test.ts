import SETTINGS from '../src/settings';
import { agent } from 'supertest';
import { app } from '../src/app';

export const req = agent(app);

describe('/', () => {
  afterAll((done) => {
    done();
  });
  it('should get app version', async () => {
    const res = await req.get(SETTINGS.PATH.DEFAULT).expect(200);
    expect(res.body).toStrictEqual({ version: '1' });
  });
});
