import { WithId } from 'mongodb';
import { BlogViewType, PostViewType } from '../types/db.type';

export const responseObjectWithId = (
  obj: WithId<BlogViewType | PostViewType>,
): BlogViewType | PostViewType => {
  const { _id, ...rest } = obj;
  return { id: _id.toString(), ...rest };
};
