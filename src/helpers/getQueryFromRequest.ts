import { Request } from 'express';

export const getQueryFromRequest = (req: Request) => {
  const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
  const pageSize: number = req.query.pageSize ? +req.query.pageSize : 10;
  const sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
  const sortDirection =
    req.query.sortDirection && req.query.sortDirection === 'asc'
      ? 'asc'
      : 'desc';
  const search =
    req.query.searchNameTerm || req.query.search
      ? req.query.searchNameTerm || req.query.search
      : undefined;

  return { pageNumber, pageSize, sortBy, sortDirection, search };
};
