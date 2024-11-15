import { describe } from 'node:test';
import { req } from './default.e2e.test';
import SETTINGS from '../src/settings';
import { BlogType } from '../src/types/db.type';

const correctAuthData: string = 'admin:qwerty';
const authData = `Basic ${Buffer.from(correctAuthData).toString('base64')}`;

describe('/blogs', () => {
  beforeAll(async () => {
    await req
      .post(SETTINGS.PATH.BLOGS)
      .set('authorization', authData)
      .send({
        name: 'asd',
        description: 'asd',
        websiteUrl: 'https://gFBG5yy0Pb59.com',
      })
      .expect(SETTINGS.STATUSES.CREATED_201);
  });

  it('should get all blogs', async () => {
    const res = await req.get(SETTINGS.PATH.BLOGS).expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((blog: BlogType) => {
      expect(blog).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        websiteUrl: expect.any(String),
      });
    });
  });

  it('should get blog by id', async () => {
    const res = await req.get(`${SETTINGS.PATH.BLOGS}/1`).expect(200);
    expect(res.body).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      websiteUrl: expect.any(String),
    });
  });
  it('should create new blog', async () => {
    const res = await req
      .post(SETTINGS.PATH.BLOGS)
      .set('authorization', authData)
      .send({
        name: 'asd',
        description: 'asd',
        websiteUrl: 'https://gFBG5yy0Pb59.com',
      })
      .expect(SETTINGS.STATUSES.CREATED_201);
    expect(res.body).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      websiteUrl: expect.any(String),
    });
  });
  it('should delete blog by id', async () => {
    await req
      .delete(`${SETTINGS.PATH.BLOGS}/2`)
      .set('authorization', authData)
      .expect(204);
  });
  it('should update blog by id', async () => {
    await req
      .put(`${SETTINGS.PATH.BLOGS}/1`)
      .set('authorization', authData)
      .send({
        name: 'hello',
        description: 'hi',
        websiteUrl: 'https://1111.com',
      })
      .expect(204);
    await req
      .put(`${SETTINGS.PATH.BLOGS}/1`)
      .send({
        name: 'hello',
        description: 'hi',
        websiteUrl: 'https://1111.com',
      })
      .expect(401);
  });
});
