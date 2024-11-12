import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';
import { getUniqueId } from '../../../helpers/getUniqueId';
import { db } from '../../../db/db';

export const addNewPost = (req: Request, res: Response) => {
  const newPost = {
    id: getUniqueId(db.posts),
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
    blogName: req.body.blogName,
  };

  const newAddedPost = postsRepository.addNewPost(newPost);
  if (!newAddedPost) {
    res.sendStatus(400);
    return;
  }
  res.status(201).send(newAddedPost);
};
