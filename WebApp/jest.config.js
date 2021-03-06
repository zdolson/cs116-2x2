module.exports = {
  "moduleNameMapper": {
    "^.+\\.(css|less|scss|svg|jpg|png)$": "identity-obj-proxy"
    // "^.+\\.js$": "babel-jest"
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/']
}
