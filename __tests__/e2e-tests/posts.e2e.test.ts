import { describe } from 'node:test';
import { req } from './default.e2e.test';
import SETTINGS from '../../src/settings';
import { STATUSES } from '../../src/common/variables/variables';
import { PostViewType } from '../../src/modules/posts/types/postsTypes';
import { runDb, stopDb } from '../../src/db/db';

let postId: string;
let blogId: string;
//@ts-ignore
const uri: string = SETTINGS.LOCAL_DB_URL;

const correctAuthData: string = 'admin:qwerty';
const authData = `Basic ${Buffer.from(correctAuthData).toString('base64')}`;
describe('/posts', () => {
  beforeAll(async () => {
    console.log('uri is ' + uri);
    await runDb(uri);
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
    blogId = resBlog.body.items[0].id;

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
    postId = resPost.body.items[0].id;
  });
  afterAll(async () => {
    await req.delete('/testing/all-data').set('authorization', authData).expect(204);
    await stopDb();
  });

  it('should get all posts', async () => {
    const res = await req.get(SETTINGS.PATH.POSTS).expect(STATUSES.OK_200);
    expect(Array.isArray(res.body.items)).toBe(true);
    res.body.items.forEach((post: PostViewType) => {
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
