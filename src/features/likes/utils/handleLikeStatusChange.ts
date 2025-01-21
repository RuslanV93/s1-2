import { MyLikesStatus } from '../../comments/types/commentsTypes';
import { likesRepository } from '../../../infrastructure/compositionRoot';
import { LikesRepository } from '../repositories/likesRepository';

export class LikeStatusChange {
  constructor(private likesRepository: LikesRepository) {}
  calculateLikeCounterChange(
    oldLikeStatus: MyLikesStatus,
    newLikeStatus: MyLikesStatus,
  ): { like: number; dislike: number } {
    switch (newLikeStatus) {
      case MyLikesStatus.none:
        if (oldLikeStatus === MyLikesStatus.like) {
          //decrement likes
          return { like: -1, dislike: 0 };
        }
        if (oldLikeStatus === MyLikesStatus.dislike) {
          // decrement dislike
          return { like: 0, dislike: -1 };
        }
        break;
      case MyLikesStatus.like:
        if (oldLikeStatus === MyLikesStatus.none) {
          //increment like
          return { like: +1, dislike: 0 };
        }
        if (oldLikeStatus === MyLikesStatus.dislike) {
          //increment like
          //decrement dislike
          return { like: +1, dislike: -1 };
        }
        break;
      case MyLikesStatus.dislike:
        if (oldLikeStatus === MyLikesStatus.none) {
          // increment dislike
          return { like: 0, dislike: +1 };
        }
        if (oldLikeStatus === MyLikesStatus.like) {
          // decrement like
          //increment dislike
          return { like: -1, dislike: +1 };
        }
        break;
    }
    return { like: 0, dislike: 0 };
  }
}
export const likeStatusChange: LikeStatusChange = new LikeStatusChange(
  likesRepository,
);
