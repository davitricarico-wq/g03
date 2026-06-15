/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
<<<<<<< HEAD
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.spec.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
=======
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
>>>>>>> 2035510dae1f06bc60d7f5913bbd67643e09750c
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts'],
    clearMocks: true
};
