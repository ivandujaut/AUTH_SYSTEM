import dotenv from 'dotenv';
import { resolve } from 'path';

// Cargar .env.test.local
dotenv.config({ path: resolve('./.env.test.local') });

export default {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: './test',
    testRegex: '.*\\.(spec|e2e-spec)\\.ts$',
    testPathIgnorePatterns: ['/node_modules/'],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/../src/$1',
    },
    testEnvironment: 'node',
};