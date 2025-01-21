import express, { Request, Response, NextFunction } from 'express';
import { blogsRouter } from './features/blogs/blogsController';
import SETTINGS from './settings';
import { postsRouter } from './features/posts/postRouter';
import { allDataRouter } from './features/testing/deleteAllData';
import { STATUSES } from './common/variables/variables';
import { usersRouter } from './features/users/usersController';
import { authRouter } from './features/auth/authController';
import { commentsRouter } from './features/comments/commentsRouter';
import cookieParser from 'cookie-parser';
import useragent from 'express-useragent';
import { securityRouter } from './features/devices/securityController';

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(useragent.express());
app.set('trust proxy', true);

app.get('/', (req: Request, res: Response) => {
  res.status(STATUSES.OK_200).json({ version: 'HELLO!' });
});

app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.TESTING, allDataRouter);
app.use(SETTINGS.PATH.USERS, usersRouter);
app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.COMMENTS, commentsRouter);
app.use(SETTINGS.PATH.SECURITY, securityRouter);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(err.message);
  return;
});
