/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/tests/integration'],
    testMatch: ['**/*.integration.test.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/integration/jest.setup.ts'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                rewriteRelativeImportExtensions: false,
            },
        }],
    },
    moduleNameMapper: {
        '^(\\.\\.?\\/.+)\\.ts$': '$1',
    },
    clearMocks: true,
    testTimeout: 30000,
    maxWorkers: 1,
};

