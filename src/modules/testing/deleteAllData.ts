import { Request, Response, Router } from 'express';
import { client, db } from '../../db/db';

import { BLOGGERS_PLATFORM, STATUSES } from '../../variables/variables';

export const allDataRouter = Router();

allDataRouter.delete('/all-data', async (req: Request, res: Response) => {
  await db.collection(BLOGGERS_PLATFORM.blogs).deleteMany({});
  await db.collection(BLOGGERS_PLATFORM.posts).deleteMany({});
  await db.collection(BLOGGERS_PLATFORM.users).deleteMany({});
  res.sendStatus(STATUSES.NO_CONTENT_204);
});
