module.exports = {
  moduleNameMapper: {
    // alias @assets imports like how it's configured in webpack
    '^@assets/(.*)': '<rootDir>/src/frontend/assets/$1',
  },
  // run setup, such as 
  setupFilesAfterEnv: [
    './src/test/frontend/jest/setup.js',
  ],
  transform: {
    // When "transform" is overwritten in any way the babel-jest is not loaded
    // automatically anymore, so it has to be explicitly defined to compile
    // JavaScript code.
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(css|less)$': './src/test/frontend/jest/styleTransform.js',
    // TODO file transform if needed
  },
};
