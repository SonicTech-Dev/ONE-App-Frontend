module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|react-native-gesture-handler' +
      '|react-native-reanimated' +
      '|@react-navigation' +
      '|react-native-vector-icons' +
      ')/)'
  ],
  setupFiles: [
    '<rootDir>/jest.setup.js',
    'react-native-gesture-handler/jestSetup'
  ],
  moduleNameMapper: {
    '^react-native-vector-icons/(.*)$': '<rootDir>/__mocks__/react-native-vector-icons.js'
    ,
    '^react-native-secure-key-store$': '<rootDir>/__mocks__/react-native-secure-key-store.js'
    ,
    '^react-native-linear-gradient$': '<rootDir>/__mocks__/react-native-linear-gradient.js'
  },
};
