import bcrypt from 'bcrypt';

export type SaltAndHash = {
  salt: string;
  hash: string;
};

export const comparePassword = async (enteredPassword: string, storedHash: string) => {
  return await bcrypt.compare(enteredPassword, storedHash);
};
