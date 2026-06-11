/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Refina o padrão de busca de arquivos
    testMatch: [
        '<rootDir>/src/tests/**/*.test.(ts|js)',
        '<rootDir>/src/tests/**/*.spec.(ts|js)'
    ],
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
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts'],
    clearMocks: true
};
