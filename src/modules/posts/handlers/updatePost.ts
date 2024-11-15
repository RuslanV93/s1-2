import { NewPostType } from '../../../types/db.type';
import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';
import SETTINGS from '../../../settings';
export const updatePost = (
  req: Request<{ id: string }, {}, NewPostType>,
  res: Response,
) => {
  const updatedPost: NewPostType = {
    id: req.params.id,
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
  };
  postsRepository.updatePostById(req.params.id, updatedPost);
  res.sendStatus(SETTINGS.STATUSES.NO_CONTENT_204);
};
