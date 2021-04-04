module.exports = {
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['./.jest/setup-jest-dom.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  testMatch: ['**/*.test.(ts|tsx)', '**/*.spec.(ts|tsx)'],
};
