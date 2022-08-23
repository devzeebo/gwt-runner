module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  roots: [
    './src',
  ],
  collectCoverageFrom: [
    './src/**/*.ts',
  ],
  coverageDirectory: './.build/coverage',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
