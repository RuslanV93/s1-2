import { describe } from 'node:test';
import SETTINGS from '../../src/settings';
import { req } from './default.e2e.test';
import {
  newTestBlog,
  newTestPost,
  newTestUserForAdminRegistration,
} from '../testData/data';
import { STATUSES } from '../../src/common/variables/variables';
import { runDb, stopDb } from '../../src/db/db';

//@ts-ignore
const uri: string = SETTINGS.LOCAL_DB_URL;

const correctAuthData: string = 'admin:qwerty';
const authData = `Basic ${Buffer.from(correctAuthData).toString('base64')}`;

describe('/comments', () => {
  let userId: string;
  let blogId: string;
  let postId: string;
  let commentId: string;
  let token: string;
  beforeAll(async () => {
    await runDb(uri);
    //creating blog
    const blog = await req
      .post(SETTINGS.PATH.BLOGS)
      .set('authorization', authData)
      .send(newTestBlog)
      .expect(STATUSES.CREATED_201);
    blogId = blog.body.id;
    //creating post
    const newPost = { ...newTestPost, blogId: blogId };
    const post = await req
      .post(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
      .set('authorization', authData)
      .send(newPost)
      .expect(STATUSES.CREATED_201);
    postId = post.body.id;
    //creating user
    const user = await req
      .post(SETTINGS.PATH.USERS)
      .set('authorization', authData)
      .send(newTestUserForAdminRegistration)
      .expect(STATUSES.CREATED_201);
    userId = user.body.id;

    const login = await req
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send({
        loginOrEmail: newTestUserForAdminRegistration.login,
        password: newTestUserForAdminRegistration.password,
      })
      .expect(STATUSES.OK_200);
    token = login.body.accessToken;
  });

  afterAll(async () => {
    await req.delete('/testing/all-data').set('authorization', authData).expect(204);
    await stopDb();
  });

  it('should add new comment', async () => {
    const res = await req
      .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
      .set('authorization', `Bearer ${token}`)
      .send({
        content:
          'Hello! This is new commentary. Its added successful if you read it',
      })
      .expect(STATUSES.CREATED_201);
    expect(res.body.content).toBe(
      'Hello! This is new commentary. Its added successful if you read it',
    );
  });

  it('should return all comments', async () => {
    const comments = await req
      .get(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
      .expect(STATUSES.OK_200);
    commentId = comments.body.items[0].id;

    expect(comments.body.items.length).toBe(1);
    expect(comments.body.items[0].commentatorInfo.userLogin).toBe('user1');
  });

  it('should return 401 error, incorrect token', async () => {
    const result = await req
      .delete(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
      .set('authorization', 'Bearer asdasd32rkd32kdlas')
      .expect(401);
  });

  it('should update comment text', async () => {
    await req
      .put(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
      .set('authorization', `Bearer ${token}`)
      .send({ content: 'HELLO THIS IS NEW COMMENT TEXT. COMMENT WAS UPDATED!' })
      .expect(STATUSES.NO_CONTENT_204);
    const comment = await req
      .get(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
      .expect(STATUSES.OK_200);
    expect(comment.body.content).toBe(
      'HELLO THIS IS NEW COMMENT TEXT. COMMENT WAS UPDATED!',
    );
  });

  it('should delete comment by id', async () => {
    await req
      .delete(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
      .set('authorization', `Bearer ${token}`)
      .expect(STATUSES.NO_CONTENT_204);
    await req
      .get(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
      .expect(STATUSES.NOT_FOUNT_404);
  });
});
