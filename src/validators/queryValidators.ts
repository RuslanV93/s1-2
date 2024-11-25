import { query, ValidationError, validationResult } from 'express-validator';

import { STATUSES } from '../variables/variables';
import { Request, Response, NextFunction } from 'express';

const queryFields = {
  searchNameTerm: 'searchNameTerm',
  sortBy: 'sortBy',
  sortDirection: 'sortDirection',
  pageNumber: 'pageNumber',
  pageSize: 'pageSize',
};

const allowedSortFields = [
  'name',
  'createdAt',
  'websiteUrl',
  'title',
  'blogName',
];
const allowedSortDirections = ['asc', 'desc'];
export const sortValidator = [
  query(queryFields.sortBy)
    .optional()
    .isString()
    .isIn(allowedSortFields)
    .withMessage('invalid sortBy value'),
  query(queryFields.sortDirection)
    .optional()
    .isString()
    .isIn(allowedSortDirections)
    .withMessage('Invalid sortDirection value. Must be "asc" or "desc"'),
  query(queryFields.pageNumber)
    .optional()
    .toInt()
    .isInt()
    .withMessage('pageNumber must be a number'),
  query(queryFields.pageSize)
    .optional()
    .toInt()
    .isInt()
    .withMessage('pageSize must be a number')
    .custom((value) => {
      return value < 100;
    })
    .withMessage('Page Size Must be less than 50'),
];

export const queryFieldsValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith((error: ValidationError) => {
      if (error.type === 'field') {
        return { message: error.msg, field: error.path };
      } else {
        return { message: error.msg, field: 'unknown' };
      }
    })
    .array({ onlyFirstError: true });
  if (errors.length > 0) {
    res.status(STATUSES.BAD_REQUEST_400).send({ errorsMessages: errors });
    return;
  }
  next();
};
