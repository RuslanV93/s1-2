// src/types/index.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      user: { id: string };
      refreshTokenPayload: {
        userId: string;
        deviceId: string;
        iat: number;
        exp: number;
      };
    }
  }
}
