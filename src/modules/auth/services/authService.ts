import { comparePassword } from '../crypto/verifyPassword';
import { authRepository } from '../repositories/authRepository';

export const authService = {
  async loginUser(loginField: string, passwordField: string) {
    const storedHash = await authRepository.getHash(loginField);
    if (!storedHash) {
      const errors: { [key: string]: string } = {};
      if (loginField.includes('@')) {
        errors.email = 'User not found. Invalid email.';
      } else {
        errors.login = 'User not found. Invalid login.';
      }
      throw {
        errorsMessages: Object.keys(errors).map(
          (field): { field: string; message: string } => ({
            field,
            message: errors[field],
          }),
        ),
      };
    }
    const passwordIsMatch = await comparePassword(passwordField, storedHash);
    if (!passwordIsMatch) {
      throw {
        errorsMessages: [{ field: 'password', message: 'Incorrect password' }],
      };
    }
    return passwordIsMatch;
  },
};
