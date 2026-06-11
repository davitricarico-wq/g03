import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts'],
    moduleNameMapper: {
        // Procura por qualquer import de arquivo local que termine com '.ts' 
        // e remove a extensão para que o Jest encontre o arquivo físico
        '^(\\.\\.?\\/.+)\\.ts$': '$1',
    },
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts'],
    clearMocks: true
};

export default config;