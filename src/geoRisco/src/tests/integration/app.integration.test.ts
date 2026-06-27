import request from 'supertest';
import { app } from '../../app';

describe('App sanity', () => {
    it('GET / returns 200', async () => {
        await request(app).get('/').expect(200, { status: 'ok', service: 'GeoRisco API' });
    });
});

