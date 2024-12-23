/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  testMatch: ['**/*.e2e.test.ts', '**/*.integration.test.ts'],
  setupFiles: ['./__tests__/jest.setup.ts'],
};
