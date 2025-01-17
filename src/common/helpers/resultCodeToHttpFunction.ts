import { DomainStatusCode } from '../types/types';
import { STATUSES } from '../variables/variables';

export const resultCodeToHttpFunction = (statusCode: DomainStatusCode) => {
  switch (statusCode) {
    case DomainStatusCode.Unauthorized: {
      return STATUSES.UNAUTHORIZED_401;
    }
    case DomainStatusCode.NotFound: {
      return STATUSES.NOT_FOUND_404;
    }
    case DomainStatusCode.Forbidden: {
      return STATUSES.FORBIDDEN_403;
    }
    case DomainStatusCode.BadRequest: {
      return STATUSES.BAD_REQUEST_400;
    }
    default:
      return STATUSES.INTERNAL_ERROR_500;
  }
};
