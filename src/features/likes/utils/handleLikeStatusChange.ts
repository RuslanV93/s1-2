import { MyLikesStatus } from '../../comments/types/commentsTypes';
import { likesRepository } from '../../../infrastructure/compositionRoot';
import { LikesRepository } from '../repositories/likesRepository';

export class LikeStatusChange {
  constructor(private likesRepository: LikesRepository) {}
  async handleLikeStatus(
    commentId: string,
    userId: string,
    oldLikeStatus: MyLikesStatus,
    newLikeStatus: MyLikesStatus,
  ) {
    try {
      switch (newLikeStatus) {
        case MyLikesStatus.none:
          if (oldLikeStatus === MyLikesStatus.like) {
            //decrement likes
            //set my status none
            const updateResult = await this.likesRepository.newLikeStatus(
              commentId,
              userId,
              newLikeStatus,
            );
          }
          if (oldLikeStatus === MyLikesStatus.dislike) {
            // decrement dislike
            //set my status none
          }
          break;
        case MyLikesStatus.like:
          if (oldLikeStatus === MyLikesStatus.none) {
            //increment like
            //set my status like
          }
          if (oldLikeStatus === MyLikesStatus.dislike) {
            //decrement dislike
            //increment like
            //set my status like
          }
          break;
        case MyLikesStatus.dislike:
          if (oldLikeStatus === MyLikesStatus.none) {
            // increment dislike
            // set my status dislike
          }
          if (oldLikeStatus === MyLikesStatus.like) {
            // decrement like
            //increment dislike
            // set my status dislike
          }
          break;
      }
      return;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
export const likeStatusChange: LikeStatusChange = new LikeStatusChange(
  likesRepository,
);
