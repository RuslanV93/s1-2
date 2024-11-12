import { BlogType, PostType } from '../types/db.type';

export const getUniqueId = (
  array: Array<BlogType> | Array<PostType>,
): string => {
  const ids = array.map((obj: BlogType | PostType) => +obj.id);
  let uniqueId = 1;
  while (ids.includes(uniqueId)) {
    uniqueId++;
  }
  return uniqueId + '';
};
