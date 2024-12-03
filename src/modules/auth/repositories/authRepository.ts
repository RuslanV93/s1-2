import { usersCollection } from '../../../db/db';
import { UserDbType } from '../../users/types/usersTypes';

const createFilter = (enteredField: string) => {
  const filter: any = {};
  if (enteredField.includes('@')) {
    filter.email = enteredField;
  } else {
    filter.login = enteredField;
  }
  return filter;
};
export const authRepository = {
  async getHash(loginField: string): Promise<string | null> {
    const filter = createFilter(loginField);
    const [user]: Array<UserDbType> = await usersCollection
      .find<UserDbType>(filter)
      .toArray();
    if (!user) {
      return null;
    }
    return user.passwordHash;
  },
};
