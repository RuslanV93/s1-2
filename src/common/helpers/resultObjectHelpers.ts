import { DomainStatusCode, Extensions, ResultObject } from '../types/types';

export const resultObject = {
  successResultObject<T>(data: T | null = null): ResultObject<T | null> {
    return {
      status: DomainStatusCode.Success,
      data: data as T,
      extensions: [],
    };
  },
  errorResultObject(status: keyof typeof DomainStatusCode, extensions: Extensions) {
    return {
      status: DomainStatusCode[status],
      data: null,
      extensions: [extensions],
    };
  },
};
