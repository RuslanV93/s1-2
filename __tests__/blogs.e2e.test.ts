import { describe } from 'node:test';
import { req } from './default.e2e.test';
import SETTINGS from '../src/settings';
import { RequestBlogType } from '../src/types/db.type';
import { STATUSES } from '../src/variables/variables';

const correctAuthData: string = 'admin:qwerty';
const authData = `Basic ${Buffer.from(correctAuthData).toString('base64')}`;
let blogId: string;

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
      .expect(STATUSES.CREATED_201);
    const res = await req.get(SETTINGS.PATH.BLOGS);
    blogId = res.body[0].id;
  });

  it('should get all blogs', async () => {
    const res = await req.get(SETTINGS.PATH.BLOGS).expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((blog: RequestBlogType) => {
      expect(blog).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        websiteUrl: expect.any(String),
      });
    });
  });

  it('should get blog by id', async () => {
    const res = await req.get(`${SETTINGS.PATH.BLOGS}/${blogId}`).expect(200);
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
      .expect(STATUSES.CREATED_201);
    expect(res.body).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      websiteUrl: expect.any(String),
    });
  });

  it('should update blog by id', async () => {
    await req
      .put(`${SETTINGS.PATH.BLOGS}/${blogId}`)
      .set('authorization', authData)
      .send({
        name: 'hello',
        description: 'hi',
        websiteUrl: 'https://1111.com',
      })
      .expect(204);
    await req
      .put(`${SETTINGS.PATH.BLOGS}/${blogId}`)
      .send({
        name: 'hello',
        description: 'hi',
        websiteUrl: 'https://1111.com',
      })
      .expect(401);
  });
  it('should delete blog by id', async () => {
    await req
      .delete(`${SETTINGS.PATH.BLOGS}/${blogId}`)
      .set('authorization', authData)
      .expect(204);
  });
});
