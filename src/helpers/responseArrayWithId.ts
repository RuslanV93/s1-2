import { BlogViewType, PostViewType } from '../types/db.type';
import { WithId } from 'mongodb';

export const responseArrayWithId = (
  arr: Array<WithId<BlogViewType | PostViewType>>,
): Array<BlogViewType | PostViewType> => {
  return arr.map((obj) => {
    const { _id, ...rest } = obj;
    return { id: _id.toString(), ...rest };
  });
};
