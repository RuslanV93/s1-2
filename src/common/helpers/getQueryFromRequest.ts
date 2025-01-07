import { Request } from 'express';
import { UsersSearchAndPaginationType } from '../../modules/users/types/usersRequestResponseTypes';

export const getQueryFromRequest = {
  getQueryFromRequest(req: any) {
    const pageNumber =
      req.query.pageNumber !== undefined ? +req.query.pageNumber : 1;
    const pageSize: number = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
    const sortDirection =
      req.query.sortDirection && req.query.sortDirection === 'asc' ? 'asc' : 'desc';
    const search =
      req.query.searchNameTerm || req.query.search
        ? req.query.searchNameTerm || req.query.search
        : undefined;

    return { pageNumber, pageSize, sortBy, sortDirection, search };
  },
  getUsersQueryFromRequest(req: Request): UsersSearchAndPaginationType {
    const pageNumber =
      req.query.pageNumber !== undefined ? +req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
    const sortDirection =
      req.query.sortDirection && req.query.sortDirection === 'asc' ? 'asc' : 'desc';
    const searchLoginTerm = req.query.searchLoginTerm
      ? String(req.query.searchLoginTerm)
      : undefined;
    const searchEmailTerm = req.query.searchEmailTerm
      ? String(req.query.searchEmailTerm)
      : undefined;
    return {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    };
  },
};
