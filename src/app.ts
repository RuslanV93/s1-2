import express from 'express';
import { Request, Response } from 'express';
import { blogsRouter } from './modules/blogs/blogsController';
import SETTINGS from './settings';
import { postsRouter } from './modules/posts/postsController';

export const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ version: '1.1' });
});

app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
