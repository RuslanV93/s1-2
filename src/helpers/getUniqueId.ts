import * as crypto from 'node:crypto';

export const getUniqueId = () => {
  return crypto.randomUUID();
};
