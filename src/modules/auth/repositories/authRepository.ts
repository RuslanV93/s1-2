import { usersCollection } from "../../../db/db";
import { UserDbType } from "../../users/types/usersTypes";
import { Document, WithId } from "mongodb";

const createFilter = (enteredField: string) => {
  const filter: any = {};
  if (enteredField.includes("@")) {
    filter.email = enteredField;
  } else {
    filter.login = enteredField;
  }
  return filter;
};
export const authRepository = {
  async getHash(loginField: string): Promise<UserDbType | null> {
    const filter = createFilter(loginField);
    const [user]: Array<UserDbType> = await usersCollection
      .find<UserDbType>(filter)
      .toArray();

    if (!user) {
      return null;
    }
    return user;
  },
  async findUserByConfirmCode(confirmCode: string) {
    const user = await usersCollection.findOne({
      "emailConfirmation.confirmationCode": confirmCode,
    });

    if (!user) {
      return null;
    }
    return user;
  },
  async registrationConfirm(
    confirmCode: string,
  ): Promise<WithId<UserDbType> | null> {
    const confirmResult = await usersCollection.findOneAndUpdate(
      {
        "emailConfirmation.confirmationCode": confirmCode,
      },
      {
        $set: { "emailConfirmation.isConfirmed": "confirmed" },
      },
      { returnDocument: "after" },
    );

    if (!confirmResult) {
      return null;
    }

    return confirmResult as UserDbType;
  },

  // find user by email
  async findUser(email: string) {
    const user: UserDbType | null = await usersCollection.findOne<UserDbType>({
      email: email,
    });
    if (!user) {
      return null;
    }
    return user;
  },

  /** Updating some email confirm fields. Update confirm code and expiration date */
  async emailConfirmationResendUpdate(
    email: string,
    newExpirationDate: Date,
    newConfirmationCode: string,
  ): Promise<UserDbType | null> {
    const updatedUser = await usersCollection.findOneAndUpdate(
      { email: email },
      {
        $set: {
          "emailConfirmation.expirationDate": newExpirationDate,
          "emailConfirmation.confirmationCode": newConfirmationCode,
        },
      },
      { returnDocument: "after" },
    );
    if (!updatedUser) {
      return null;
    }
    return updatedUser as UserDbType;
  },
};
