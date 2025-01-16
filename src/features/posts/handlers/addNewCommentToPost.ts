import { Request, Response } from 'express';
import { STATUSES } from '../../../common/variables/variables';
import { usersQueryRepository } from '../../users/repositories/usersQueryRepository';
import { UserViewType } from '../../users/types/usersTypes';
import {
  CommentsRequestWithBodyType,
  CommentsRequestWithParamsType,
} from '../../comments/types/commentsResponseRequestTypes';
import { ObjectId } from 'mongodb';
import { DomainStatusCode } from '../../../common/types/types';
import { resultCodeToHttpFunction } from '../../../common/helpers/resultCodeToHttpFunction';
import {
  commentsQueryRepository,
  commentsService,
} from '../../../infrastructure/compositionRoot';

export const addNewCommentToPost = async (
  req: Request<CommentsRequestWithParamsType, {}, CommentsRequestWithBodyType>,
  res: Response,
) => {
  const userId = req.user.id;
  if (!userId) {
    res.sendStatus(STATUSES.UNAUTHORIZED_401);
    return;
  }

  const commentator: UserViewType | null =
    await usersQueryRepository.getUserById(userId);

  const commentatorInfo = {
    userId: new ObjectId(userId),
    userLogin: commentator!.login,
  };

  const newAddedCommentResult = await commentsService.addNewComment(
    req.params.id,
    req.body,
    commentatorInfo,
  );
  if (newAddedCommentResult.status !== DomainStatusCode.Success) {
    res.sendStatus(resultCodeToHttpFunction(newAddedCommentResult.status));
    return;
  }

  const newAddedComment = await commentsQueryRepository.getCommentById(
    newAddedCommentResult.data!.toString(),
  );
  res.status(STATUSES.CREATED_201).send(newAddedComment);
};
