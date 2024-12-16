import bcrypt from 'bcrypt';

export type SaltAndHashType = {
  salt: string;
  passwordHash: string;
};

export const genHashFunction = async (pass: string): Promise<SaltAndHashType> => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(pass, salt);
  return { salt, passwordHash };
};
