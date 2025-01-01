import { ObjectId } from 'mongodb';

/** Rate limit types */
export type ApiRequestControlDbType = {
  id: ObjectId;
  ip: string;
  URL: string;
  date: string;
};
export type NewApiRequestControlType = {
  ip: string;
  URL: string;
  date: Date;
};
