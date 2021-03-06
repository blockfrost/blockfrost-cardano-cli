module.exports = {
  rootDir: '.',
  resetMocks: true,
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: true,
  modulePathIgnorePatterns: ['__mocks__'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['<rootDir>/**/__tests__/**/*.test.ts'],
  coverageReporters: ['json-summary', 'lcov', 'text', 'text-summary'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  preset: 'ts-jest',
};
