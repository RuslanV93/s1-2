import { NextFunction, Request, Response } from 'express';

import { STATUSES } from '../common/variables/variables';
import { authService } from '../modules/auth/services/authService';
import { usersQueryRepository } from '../modules/users/repositories/usersQueryRepository';
import { jwtService } from '../common/crypto/jwtService';

/// BASIC auth validation
export const authValidatorMiddleware = (
  req: Request<{}, {}, {}, { authorization: string }>,
  res: Response,
  next: NextFunction,
) => {
  const authData = process.env.AUTH;
  const auth: string = req.headers['authorization'] as string;
  if (!auth) {
    res.sendStatus(STATUSES.UNAUTHORIZED_401);
    return;
  }
  const decodedAuth = Buffer.from(auth.slice(6), 'base64').toString('utf8');

  if (auth.slice(0, 5) !== 'Basic' || decodedAuth !== authData) {
    res.sendStatus(STATUSES.UNAUTHORIZED_401);
    return;
  }

  next();
};

// token auth validation
export const accessTokenValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    res.sendStatus(STATUSES.UNAUTHORIZED_401);
    return;
  }
  const [authType, token] = req.headers.authorization.split(' ');

  if (authType !== 'Bearer' || !token) {
    res.sendStatus(STATUSES.UNAUTHORIZED_401);
    return;
  }
  const payload = await jwtService.getUserByToken(token);
  if (!payload) {
    res.sendStatus(STATUSES.UNAUTHORIZED_401);
    return;
  }
  if (payload) {
    const { userId } = payload;
    const user = await usersQueryRepository.getUserById(userId);
    if (!user) {
      res.sendStatus(STATUSES.UNAUTHORIZED_401);
      return;
    }
    req.user = { id: userId };
    next();
  }
};
