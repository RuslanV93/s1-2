import { blogsRepository } from '../repositories/blogsRepository';
import { Request, Response } from 'express';
import { STATUSES } from '../../../variables/variables';
import { responseArrayWithId } from '../../../helpers/responseArrayWithId';
import { WithId } from 'mongodb';
import { BlogViewType } from '../../../types/db.type';

export const getBlogs = async (req: Request, res: Response) => {
  const blogs: Array<WithId<BlogViewType>> = await blogsRepository.getBlogs();
  res.status(STATUSES.OK_200).send(responseArrayWithId(blogs));
};
