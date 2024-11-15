import { Request, Response } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';
import { BlogType } from '../../../types/db.type';
import { getUniqueId } from '../../../helpers/getUniqueId';
import { db } from '../../../db/db';
import SETTINGS from '../../../settings';

export const addNewBlog = (req: Request, res: Response) => {
  const newBlog: BlogType = {
    id: getUniqueId(db.blogs),
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };

  const newAddedBlog = blogsRepository.addNewBlog(newBlog);
  if (!newAddedBlog) {
    res.sendStatus(SETTINGS.STATUSES.BAD_REQUEST_400);
  }
  res.status(SETTINGS.STATUSES.CREATED_201).send(newAddedBlog);
};
