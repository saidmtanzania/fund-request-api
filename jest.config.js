module.exports = {
  preset: 'ts-jest',
  roots: ['./tests'],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.test.{ts,tsx}', '!**/Server.ts'],
  collectCoverage: true,
  testEnvironment: 'node',
  testResultsProcessor: 'jest-sonar-reporter',
  setupFiles: ['dotenv/config'],
};
