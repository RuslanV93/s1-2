import { describe } from 'node:test';
import { req } from './default.e2e.test';
import SETTINGS from '../src/settings';
import { PostType } from '../src/types/db.type';

const correctAuthData: string = 'admin:qwerty';

const authData = `Basic ${Buffer.from(correctAuthData).toString('base64')}`;

describe('/posts', () => {
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
    await req
      .post(SETTINGS.PATH.POSTS)
      .set('authorization', authData)
      .send({
        title: 'title',
        shortDescription: 'desc',
        content: 'string',
        blogId: '1',
      })
      .expect(SETTINGS.STATUSES.CREATED_201);
  });

  it('should get all posts', async () => {
    const res = await req
      .get(SETTINGS.PATH.POSTS)
      .expect(SETTINGS.STATUSES.OK_200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((post: PostType) => {
      expect(post).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        shortDescription: expect.any(String),
        content: expect.any(String),
        blogId: expect.any(String),
        blogName: expect.any(String),
      });
    });
  });
  it('should get post by id', async () => {
    const res = await req
      .get(`${SETTINGS.PATH.POSTS}/1`)
      .expect(SETTINGS.STATUSES.OK_200);
    expect(res.body).toMatchObject({
      id: '1',
      title: 'title',
      shortDescription: 'desc',
      content: 'string',
      blogId: '1',
      blogName: expect.any(String),
    });
  });
  it('should add new post', async () => {
    const res = await req
      .post(SETTINGS.PATH.POSTS)
      .set('authorization', authData)
      .send({
        title: 'title',
        shortDescription: 'desc',
        content: 'string',
        blogId: '1',
      })
      .expect(SETTINGS.STATUSES.CREATED_201);
    expect(res.body).toMatchObject({
      id: '2',
      title: 'title',
      shortDescription: 'desc',
      content: 'string',
      blogId: '1',
      blogName: expect.any(String),
    });
  });
  it('should delete post by id', async () => {
    await req
      .delete(`${SETTINGS.PATH.POSTS}/2`)
      .set('authorization', authData)
      .expect(SETTINGS.STATUSES.NO_CONTENT_204);
    await req.delete(`${SETTINGS.PATH.POSTS}/1`).expect(401);
  });
});
