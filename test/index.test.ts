import { describe, expect, it } from 'bun:test';
import { app } from '../server/src/server';

describe('Elysia', () => {
    it('returns a response', async () => {
        const response = await app
            .handle(
                new Request(
                    'http://localhost/.well-known/openid-configuration',
                ),
            )
            .then((res) => res.text());
        console.log(response);
        expect(response).toBe('hi');
    });
});
