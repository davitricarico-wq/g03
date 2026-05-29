/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/dist/**/*.spec.js'],
    collectCoverageFrom: ['dist/**/*.js', '!dist/**/*.spec.js'],
    clearMocks: true
};
