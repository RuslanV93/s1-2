import { Request, Response, Router } from 'express';
import { db } from '../../db/db';
import SETTINGS from '../../settings';

export const allDataRouter = Router();

allDataRouter.delete('/all-data', (req: Request, res: Response) => {
  db.posts = [];
  db.blogs = [];
  res.sendStatus(SETTINGS.STATUSES.NO_CONTENT_204);
});
