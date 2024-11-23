import { after, describe } from 'node:test';
import { req } from './default.e2e.test';
import SETTINGS from '../src/settings';
import { STATUSES } from '../src/variables/variables';
import { PostViewType } from '../src/types/db.type';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

let postId: string;
let blogId: string;

const correctAuthData: string = 'admin:qwerty';
const authData = `Basic ${Buffer.from(correctAuthData).toString('base64')}`;
jest.setTimeout(100000);
describe('/posts', () => {
  let server: MongoMemoryServer;
  let client: MongoClient;
  beforeAll(async () => {
    server = await MongoMemoryServer.create();
    const uri = server.getUri();
    client = new MongoClient(uri);

    await req
      .post(SETTINGS.PATH.BLOGS)
      .set('authorization', authData)
      .send({
        name: 'asd',
        description: 'asd',
        websiteUrl: 'https://gFBG5yy0Pb59.com',
      })
      .expect(STATUSES.CREATED_201);
    const resBlog = await req.get(SETTINGS.PATH.BLOGS);
    blogId = resBlog.body[0].id;

    await req
      .post(SETTINGS.PATH.POSTS)
      .set('authorization', authData)
      .send({
        title: 'title',
        shortDescription: 'desc',
        content: 'string',
        blogId: `${blogId}`,
      })
      .expect(STATUSES.CREATED_201);
    const resPost = await req.get(SETTINGS.PATH.POSTS);
    postId = resPost.body[0].id;
  });
  afterAll(async () => {
    if (server) {
      await server.stop();
    }
    if (client) {
      await client.close();
    }
  });

  it('should get all posts', async () => {
    const res = await req.get(SETTINGS.PATH.POSTS).expect(STATUSES.OK_200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((post: PostViewType) => {
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
      .get(`${SETTINGS.PATH.POSTS}/${postId}`)
      .expect(STATUSES.OK_200);
    expect(res.body).toMatchObject({
      id: `${postId}`,
      title: 'title',
      shortDescription: 'desc',
      content: 'string',
      blogId: `${blogId}`,
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
        blogId: `${blogId}`,
      })
      .expect(STATUSES.CREATED_201);

    expect(res.body).toMatchObject({
      id: res.body.id,
      title: 'title',
      shortDescription: 'desc',
      content: 'string',
      blogId: `${blogId}`,
      blogName: expect.any(String),
    });
  });
  it('should delete post by id', async () => {
    await req
      .delete(`${SETTINGS.PATH.POSTS}/` + postId)
      .set('authorization', authData)
      .expect(STATUSES.NO_CONTENT_204);
    await req
      .delete(`${SETTINGS.PATH.POSTS}/${postId}`)
      .expect(STATUSES.UNAUTHORIZED_401);
  });
});
