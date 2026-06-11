/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/dist/**/*.spec.js'],
    collectCoverageFrom: ['dist/services/**/*.js', '!dist/**/*.spec.js'],
    coverageDirectory: '../../coverage/services',
    setupFiles: ['<rootDir>/dist/tests/jest.setup.js'],
    clearMocks: true
};
