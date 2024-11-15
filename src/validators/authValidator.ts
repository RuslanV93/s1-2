import { Request, Response, NextFunction } from 'express';
import SETTINGS from '../settings';

export const authValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authData = process.env.AUTH;
  const auth: string = req.headers['authorization'] as string;
  if (!auth) {
    res.sendStatus(SETTINGS.STATUSES.UNAUTHORIZED_401);
    return;
  }
  const decodedAuth = Buffer.from(auth.slice(6), 'base64').toString('utf8');

  if (auth.slice(0, 5) !== 'Basic' || decodedAuth !== authData) {
    res.sendStatus(SETTINGS.STATUSES.UNAUTHORIZED_401);
    return;
  }

  next();
};
