import { ResultObject } from '../types/types';

export function isResultObject<Data>(obj: any): obj is ResultObject<Data> {
  return (
    obj &&
    typeof obj === 'object' &&
    'status' in obj &&
    'extensions' in obj &&
    'data' in obj
  );
}