import { describe } from 'node:test';
import { req } from './default.e2e.test';
import SETTINGS from '../../src/settings';
import { STATUSES } from '../../src/common/variables/variables';
import { BlogViewType } from '../../src/modules/blogs/types/blogsTypes';
import { runDb, stopDb } from '../../src/db/db';

//@ts-ignore
const uri: string = SETTINGS.LOCAL_DB_URL;
const correctAuthData: string = 'admin:qwerty';
const authData = `Basic ${Buffer.from(correctAuthData).toString('base64')}`;
describe('/blogs', () => {
  let newBlogForTest: any;
  let newBlogForTestId: string;
  beforeAll(async () => {
    await runDb(uri);
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
    await req
      .delete('/testing/all-data')
      .set('authorization', authData)
      .expect(STATUSES.NO_CONTENT_204);
    await stopDb();
  });
  it('should return all blogs', async () => {
    const res = await req.get(SETTINGS.PATH.BLOGS).expect(STATUSES.OK_200);
    res.body.items.forEach((blog: BlogViewType) => {
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

  it('should add post to blog', async () => {
    const res = await req
      .post(`${SETTINGS.PATH.BLOGS}/${newBlogForTestId}/posts`)
      .set('authorization', authData)
      .send({
        title: 'string',
        shortDescription: 'string',
        content: 'string',
      })
      .expect(STATUSES.CREATED_201);

    expect(res.body).toMatchObject({
      id: expect.any(String),
      title: 'string',
      shortDescription: 'string',
      content: 'string',
      blogId: newBlogForTestId,
      blogName: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('should get posts by blogId', async () => {
    const res = await req
      .get(`${SETTINGS.PATH.BLOGS}/${newBlogForTestId}/posts`)
      .expect(200);
    expect(res.body).toMatchObject({
      pagesCount: expect.any(Number),
      page: expect.any(Number),
      pageSize: expect.any(Number),
      totalCount: expect.any(Number),
      items: expect.any(Array),
    });
    await req
      .get(`${SETTINGS.PATH.BLOGS}/6745ab1f9dcdf183ecf73778/posts`)
      .expect(STATUSES.NOT_FOUNT_404);
  });
  it('should delete blog by id', async () => {
    await req
      .delete(`${SETTINGS.PATH.BLOGS}/${newBlogForTestId}`)
      .set('authorization', authData)
      .expect(STATUSES.NO_CONTENT_204);

    await req
      .get(`${SETTINGS.PATH.BLOGS}/${newBlogForTestId}`)
      .expect(STATUSES.NOT_FOUNT_404);
  });
});
