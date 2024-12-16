import express from 'express';
import { Request, Response } from 'express';
import { blogsRouter } from './modules/blogs/blogsController';
import SETTINGS from './settings';
import { postsRouter } from './modules/posts/postsController';
import { allDataRouter } from './modules/testing/deleteAllData';
import { STATUSES } from './common/variables/variables';
import { usersRouter } from './modules/users/usersController';
import { authRouter } from './modules/auth/authController';
import { commentsRouter } from './modules/comments/commentsController';

export const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(STATUSES.OK_200).json({ version: 'HELLO!' });
});

app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.TESTING, allDataRouter);
app.use(SETTINGS.PATH.USERS, usersRouter);
app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.COMMENTS, commentsRouter);
