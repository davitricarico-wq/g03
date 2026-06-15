import type { Config } from 'jest';

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts', '**/*.spec.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    setupFiles: ['<rootDir>/src/tests/jest.setup.ts'],
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
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts', '!src/**/*.spec.ts'],
    clearMocks: true
} satisfies Config;
