import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'node',
    testMatch: ['**/dist/**/*.spec.js'],
    collectCoverageFrom: ['dist/services/**/*.js', '!dist/**/*.spec.js'],
    coverageDirectory: '../../coverage/services',
    setupFiles: ['<rootDir>/dist/tests/jest.setup.js'],
    clearMocks: true
};

export default config;
