import { blogsRepository } from '../repositories/blogsRepository';
import { Request, Response } from 'express';
import { STATUSES } from '../../../variables/variables';
import { responseArrayWithId } from '../../../helpers/responseArrayWithId';
import { WithId } from 'mongodb';
import { BlogViewType } from '../../../types/db.type';
import { blogsService } from '../services/blogsService';

export const getBlogs = async (req: Request, res: Response) => {
  const blogs: Array<WithId<BlogViewType>> = await blogsService.getBlogs();
  res.status(STATUSES.OK_200).send(responseArrayWithId(blogs));
};
