import { Request, Response, NextFunction } from 'express';
import { apiRequestsCollection } from '../db/db';
import { STATUSES } from '../common/variables/variables';

export const requestControl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const limit = 5;
  const timeWindow = 10 * 1000; // Лучше вынести в константы

  const ip =
    (Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for']) ||
    req.socket.remoteAddress ||
    '0.0.0.0';

  const url = req.originalUrl; // baseUrl может быть undefined, достаточно originalUrl
  const now = new Date();

  try {
    const requestCount = await apiRequestsCollection.countDocuments({
      ip,
      URL: url,
      date: { $gte: new Date(now.getTime() - timeWindow) },
    });

    if (requestCount >= limit) {
      res.sendStatus(STATUSES.TOO_MANY_REQUEST_429);
      return;
    }

    await apiRequestsCollection.insertOne({ ip, URL: url, date: now });
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
