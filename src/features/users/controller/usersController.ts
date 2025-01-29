import { Request, Response } from 'express';
import {
  UserRequestTypeWithBody,
  UserRequestWithParamsType,
  UserRequestWithQueryType,
} from '../types/usersRequestResponseTypes';
import { getQueryFromRequest } from '../../../common/helpers/getQueryFromRequest';
import { STATUSES } from '../../../common/variables/variables';
import { ObjectId } from 'mongodb';
import { inject, injectable } from 'inversify';
import { UsersService } from '../services/usersService';
import { UsersQueryRepository } from '../repositories/usersQueryRepository';
import { UsersRepository } from '../repositories/usersRepository';
import { UserDbType } from '../types/usersTypes';

@injectable()
export class UsersController {
  constructor(
    @inject(UsersService) private usersService: UsersService,
    @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
    @inject(UsersRepository) private usersRepository: UsersRepository,
  ) {}
  async getUsers(req: Request<{}, UserRequestWithQueryType>, res: Response) {
    const searchAndPaginationParams =
      getQueryFromRequest.getUsersQueryFromRequest(req);
    const users = await this.usersQueryRepository.getUsers(
      searchAndPaginationParams,
    );
    res.status(200).send(users);
  }

  async addNewUser(req: Request<{}, {}, UserRequestTypeWithBody>, res: Response) {
    try {
      const newAddedUserId: string | null = await this.usersService.addNewUser(
        req.body.login,
        req.body.email,
        req.body.password,
      );

      if (!newAddedUserId) {
        res.sendStatus(STATUSES.BAD_REQUEST_400);
        return;
      }
      const newAddedUser =
        await this.usersQueryRepository.getUserById(newAddedUserId);
      res.status(201).send(newAddedUser);
      return;
    } catch (error: any) {
      if (error.errorsMessages) {
        res.status(400).send(error);
      }
    }
  }

  async deleteUser(req: Request<UserRequestWithParamsType>, res: Response) {
    const userForDelete: UserDbType | null = await this.usersRepository.getUserById(
      new ObjectId(req.params.id),
    );
    if (!userForDelete) {
      res.status(STATUSES.NOT_FOUND_404).send('User not Found!');
      return;
    }
    const deleteResult = await this.usersService.deleteUser(userForDelete._id);

    if (!deleteResult) {
      res
        .status(STATUSES.BAD_REQUEST_400)
        .send('Something went wrong. User not deleted.');
      return;
    }
    res.sendStatus(STATUSES.NO_CONTENT_204);
  }
}
