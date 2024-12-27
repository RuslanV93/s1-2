import { Request, Response, Router } from 'express';
import { STATUSES } from '../../common/variables/variables';
import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  usersCollection,
} from '../../db/db';

export const allDataRouter = Router();

allDataRouter.delete('/all-data', async (req: Request, res: Response) => {
  await blogsCollection.deleteMany({});
  await postsCollection.deleteMany({});
  await usersCollection.deleteMany({});
  await commentsCollection.deleteMany({});

  res.sendStatus(STATUSES.NO_CONTENT_204);
});
