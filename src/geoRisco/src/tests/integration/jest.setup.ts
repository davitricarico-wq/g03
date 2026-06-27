import 'dotenv/config';

if (process.env.RUN_DB_TESTS !== 'true') {
    throw new Error('Integration tests require RUN_DB_TESTS=true.');
}

if (!process.env.DATABASE_URL) {
    throw new Error('Integration tests require DATABASE_URL to point to a real database.');
}

jest.setTimeout(30000);

