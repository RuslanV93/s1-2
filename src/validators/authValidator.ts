import { Request, Response, NextFunction } from 'express';
import SETTINGS from '../settings';

export const authValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth: string = req.headers['authorization'] as string;
  if (!auth) {
    res.sendStatus(401);
    return;
  }
  const decodedAuth = Buffer.from(auth.slice(6), 'base64').toString('utf8');

  if (auth.slice(0, 5) !== 'Basic' || decodedAuth !== SETTINGS.AUTH) {
    res.sendStatus(401);
    return;
  }

  next();
};
