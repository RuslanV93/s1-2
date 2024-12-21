import { Request, Response, Router } from 'express';
import { bloggers_platform_db } from '../../db/db';

import { BLOGGERS_PLATFORM, STATUSES } from '../../common/variables/variables';

export const allDataRouter = Router();

allDataRouter.delete('/all-data', async (req: Request, res: Response) => {
  await bloggers_platform_db.collection(BLOGGERS_PLATFORM.blogs).deleteMany({});
  await bloggers_platform_db.collection(BLOGGERS_PLATFORM.posts).deleteMany({});
  await bloggers_platform_db.collection(BLOGGERS_PLATFORM.users).deleteMany({});
  await bloggers_platform_db.collection(BLOGGERS_PLATFORM.comments).deleteMany({});
  res.sendStatus(STATUSES.NO_CONTENT_204);
});
