import { LikesRepository } from '../repositories/likesRepository';
import { MyLikesStatus } from '../../comments/types/commentsTypes';
import { resultObject } from '../../../common/helpers/resultObjectHelpers';
import { LikeStatusChange } from '../utils/handleLikeStatusChange';
import { CommentsRepository } from '../../comments/repositories/commentsRepository';
import { inject, injectable } from 'inversify';
import { PostsRepository } from '../../posts/repositories/postsRepository';
import { ObjectId } from 'mongodb';
import { PostLikeModelType, PostLikesModel } from '../domain/likes.entity';
import { UsersRepository } from '../../users/repositories/usersRepository';
import { UserDbType } from '../../users/types/usersTypes';

@injectable()
export class LikesService {
  constructor(
    @inject(LikesRepository) private likesRepository: LikesRepository,
    @inject(LikeStatusChange) private likeStatusChange: LikeStatusChange,
    @inject(CommentsRepository) private commentsRepository: CommentsRepository,
    @inject(PostsRepository) private postsRepository: PostsRepository,
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(PostLikesModel) private postLikesModel: PostLikeModelType,
  ) {}
  async updateCommentLikeStatus(
    commentId: string,
    userId: string,
    oldLikeStatus: MyLikesStatus,
    newLikeStatus: MyLikesStatus,
  ) {
    try {
      const comment = await this.commentsRepository.findComment(commentId);
      if (!comment) {
        return resultObject.notFoundResultObject({
          message: 'Comment not found!',
          field: 'commentId',
        });
      }
      if (newLikeStatus === oldLikeStatus) {
        return resultObject.successResultObject({
          message: 'Status has already been set!',
          field: 'likeStatus',
        });
      }
      /** getting counter object */
      const likeAndDislikeCounters =
        this.likeStatusChange.calculateLikeCounterChange(
          oldLikeStatus,
          newLikeStatus,
        );

      /** Updating like Status*/
      const likeStatusUpdateResult =
        await this.likesRepository.setNewCommentLikeStatus(
          commentId,
          userId,
          newLikeStatus,
        );
      if (likeStatusUpdateResult) {
      }

      await this.commentsRepository.changeLikesCount(
        commentId,
        likeAndDislikeCounters,
      );
      return resultObject.successResultObject();
    } catch (e) {
      return resultObject.internalErrorResultObject();
    }
  }
  /** UPDATING POST LIKES FIELD, OR CREATE NEW IF IT DOESN'T EXIST */
  async updatePostLikeStatus(
    postId: string,
    userId: string,
    oldLikeStatus: MyLikesStatus,
    newLikeStatus: MyLikesStatus,
  ) {
    const existingPost = await this.postsRepository.getPostById(
      new ObjectId(postId),
    );

    const user: UserDbType | null = await this.usersRepository.getUserById(
      new ObjectId(userId),
    );

    if (!existingPost) {
      return resultObject.notFoundResultObject({
        message: 'Post not found!',
        field: 'postId',
      });
    }
    if (newLikeStatus === oldLikeStatus) {
      return resultObject.successResultObject();
    }
    const likesAndDislikeCounter = this.likeStatusChange.calculateLikeCounterChange(
      oldLikeStatus,
      newLikeStatus,
    );
    const like = await this.likesRepository.findPostLike(postId, userId);

    // if like doesn't exist, creating new like
    if (!like) {
      const like = this.postLikesModel.makeInstance(
        newLikeStatus,
        userId,
        postId,
        user!.login,
      );

      try {
        await this.likesRepository.saveLike(like);
      } catch (error) {
        console.error(error);
        return resultObject.internalErrorResultObject();
      }
    } else {
      try {
        like.updateLikeFields(newLikeStatus);
        await this.likesRepository.saveLike(like);
      } catch (error) {
        console.error(error);
        return resultObject.internalErrorResultObject();
      }
    }
    try {
      existingPost.updateLikesCount(likesAndDislikeCounter);
      await this.postsRepository.postSave(existingPost);
      return resultObject.successResultObject();
    } catch (e) {
      console.error(e);
      return resultObject.internalErrorResultObject();
    }
  }
}
