import { Request, Response } from 'express';
import { blogsRepository } from '../repositories/blogsRepository';
import { BlogType } from '../../../types/db.type';
import { getUniqueId } from '../../../helpers/getUniqueId';
import { db } from '../../../db/db';

export const addNewBlog = (req: Request, res: Response) => {
  const newBlog: BlogType = {
    id: getUniqueId(db.blogs),
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };

  const newAddedBlog = blogsRepository.addNewBlog(newBlog);
  if (!newAddedBlog) {
    res.sendStatus(400);
  }
  res.status(201).send(newAddedBlog);
};
