import { authRepository } from '../../src/modules/auth/repositories/authRepository';
import { DomainStatusCode } from '../../src/common/types/types';
import { authService } from '../../src/modules/auth/services/authService';

describe('/auth', () => {
  authRepository.updateRefreshToken = jest
    .fn()
    .mockImplementation((userId, refreshToken) => {
      return Promise.resolve({
        status: DomainStatusCode.Success,
        data: {},
        extensions: [],
      });
    });
  it('should create jwt token', async () => {
    const result = await authService.updateRefreshToken('1', '1');
    expect(result).toMatchObject({
      status: DomainStatusCode.Success,
      data: {},
      extensions: [],
    });
    expect(authRepository.updateRefreshToken).toBeCalledTimes(1);
  });
});
