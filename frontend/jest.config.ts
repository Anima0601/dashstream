module.exports = {
  testEnvironment: 'jsdom',

  setupFiles: [
    '<rootDir>/jest.polyfills.ts', 
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
};