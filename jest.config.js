module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  reporters: [
    'default',
    [
      'jest-junit',
      { outputDirectory: 'test-reports', outputName: 'unit-report.xml' },
    ],
  ],
};
