import { Request, Response, Router } from 'express';
import { db } from '../../db/db';

import { STATUSES } from '../../variables/statusVariables';

export const allDataRouter = Router();

allDataRouter.delete('/all-data', (req: Request, res: Response) => {
  db.posts = [];
  db.blogs = [];
  res.sendStatus(STATUSES.NO_CONTENT_204);
});
