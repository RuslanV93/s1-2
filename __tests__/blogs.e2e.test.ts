import { describe } from 'node:test';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { req } from './default.e2e.test';
import SETTINGS from '../src/settings';
import { BlogViewType } from '../src/types/db.type';
import { STATUSES } from '../src/variables/variables';

const correctAuthData: string = 'admin:qwerty';
const authData = `Basic ${Buffer.from(correctAuthData).toString('base64')}`;
jest.setTimeout(100000);
describe('/blogs', () => {
  let server: MongoMemoryServer;
  let client: MongoClient;
  let newBlogForTest;
  let newBlogForTestId: string;
  beforeAll(async () => {
    server = await MongoMemoryServer.create();
    const uri = server.getUri();
    client = new MongoClient(uri);
    await client.connect();

    const newBlog = {
      name: 'asd',
      description: 'asd',
      websiteUrl: 'https://gFBG5yy0Pb59.com',
    };
    newBlogForTest = await req
      .post(SETTINGS.PATH.BLOGS)
      .set('authorization', authData)
      .send(newBlog)
      .expect(STATUSES.CREATED_201);
    newBlogForTestId = newBlogForTest.body.id;
  });

  afterAll(async () => {
    if (server) {
      await server.stop();
    }
    if (client) {
      await client.close();
    }
  });
  it('should return all blogs', async () => {
    const res = await req.get(SETTINGS.PATH.BLOGS).expect(STATUSES.OK_200);
    res.body.forEach((blog: BlogViewType) => {
      expect(blog).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        websiteUrl: expect.any(String),
        createdAt: expect.any(String),
        isMembership: expect.any(Boolean),
      });
    });
  });
  it('should return blog by id', async () => {
    const res = await req
      .get(`${SETTINGS.PATH.BLOGS}/${newBlogForTestId}`)
      .expect(STATUSES.OK_200);
    expect(res.body).toMatchObject({
      id: newBlogForTestId,
      name: expect.any(String),
      description: expect.any(String),
      websiteUrl: expect.any(String),
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean),
    });
  });
  it('should create new blog', async () => {
    const res = await req
      .post(SETTINGS.PATH.BLOGS)
      .set('authorization', authData)
      .send({
        name: 'Hello',
        description: 'Hi',
        websiteUrl: 'https://hello.com',
      })
      .expect(STATUSES.CREATED_201);
    expect(res.body).toMatchObject({
      id: expect.any(String),
      name: 'Hello',
      description: 'Hi',
      websiteUrl: 'https://hello.com',
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean),
    });
  });
  it('should update blog by id', async () => {
    await req
      .put(`${SETTINGS.PATH.BLOGS}/${newBlogForTestId}`)
      .set('authorization', authData)
      .send({
        name: 'pasha',
        description: '1',
        websiteUrl: 'https://pasha.com',
      })
      .expect(STATUSES.NO_CONTENT_204);
    const res = await req
      .get(`${SETTINGS.PATH.BLOGS}/${newBlogForTestId}`)
      .expect(STATUSES.OK_200);
    expect(res.body).toMatchObject({
      id: expect.any(String),
      name: 'pasha',
      description: '1',
      websiteUrl: 'https://pasha.com',
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean),
    });
  });
  it('should delete blog by id', async () => {
    const blogs = await req.get(SETTINGS.PATH.BLOGS).expect(STATUSES.OK_200);
    const blogsLength = blogs.body.length;
    await req
      .delete(`${SETTINGS.PATH.BLOGS}/${newBlogForTestId}`)
      .set('authorization', authData)
      .expect(STATUSES.NO_CONTENT_204);
    const res = await req.get(SETTINGS.PATH.BLOGS).expect(STATUSES.OK_200);
    expect(res.body.length).toBe(blogsLength - 1);
    await req
      .get(`${SETTINGS.PATH.BLOGS}/${newBlogForTestId}`)
      .expect(STATUSES.NOT_FOUNT_404);
  });
});
