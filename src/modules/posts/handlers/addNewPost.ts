import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';
import { getUniqueId } from '../../../helpers/getUniqueId';
import { db } from '../../../db/db';
import { NewPostType } from '../../../types/db.type';
import SETTINGS from '../../../settings';

export const addNewPost = (req: Request, res: Response) => {
  const newPost: NewPostType = {
    id: getUniqueId(db.posts),
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
    blogName: req.body.blogName || new Date().toISOString(),
  };

  const newAddedPost = postsRepository.addNewPost(newPost);
  if (!newAddedPost) {
    res.sendStatus(SETTINGS.STATUSES.BAD_REQUEST_400);
    return;
  }
  res.status(SETTINGS.STATUSES.CREATED_201).send(newAddedPost);
};
