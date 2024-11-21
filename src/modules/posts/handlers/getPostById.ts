import { Request, Response } from 'express';
import { postsRepository } from '../repositories/postsRepository';

import { postRequestTypeWithParams } from '../types/postsRequestResponseTypes';
import { STATUSES } from '../../../variables/variables';
import { responseObjectWithId } from '../../../helpers/responseObjectWithId';

export const getPostById = async (
  req: Request<postRequestTypeWithParams>,
  res: Response,
) => {
  const id = req.params.id;
  const post = await postsRepository.getPostById(id);

  if (!post) {
    res.sendStatus(STATUSES.NOT_FOUNT_404);
    return;
  }
  res.status(STATUSES.OK_200).send(responseObjectWithId(post));
};
