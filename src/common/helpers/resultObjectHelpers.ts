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
  internalErrorResultObject() {
    return {
      status: DomainStatusCode.InternalServerError,
      data: null,
      extensions: [{ message: 'Internal Server Error' }],
    };
  },
  unauthorizedResultObject(extensions: Extensions) {
    return {
      status: DomainStatusCode.Unauthorized,
      data: null,
      extensions: [extensions],
    };
  },
  notFoundResultObject(extensions: Extensions) {
    return {
      status: DomainStatusCode.NotFound,
      data: null,
      extensions: [extensions],
    };
  },
  badRequestResultObject(extensions: Extensions) {
    return {
      status: DomainStatusCode.BadRequest,
      data: null,
      extensions: [extensions],
    };
  },
};
