import { describe, expect, it } from 'bun:test';
import { app } from '../src/server';
import { clients } from '$db/clients';
import { generateAuthorizationUrl } from '$lib/oauth';

const c = clients[0];
const code_challenge = 'code_challenge';
const nonce = 'nonce';
const response_type = 'post';
const scope = 'openid profile';
const state = 'state';
const url = 'http://localhost/oauth/authorization';

describe('authorization', () => {
    it('returns invalid schema', async () => {
        const response = await app.handle(
            new Request(url, {
                method: 'GET',
            }),
        );
        expect(response.status).toBe(422);
    });

    it('returns not found', async () => {
        const authUrl = generateAuthorizationUrl(
            url,
            'client_does_not_exist',
            c.redirect_uri,
            code_challenge,
            nonce,
            state,
        );
        const response = await app.handle(
            new Request(authUrl, {
                method: 'GET',
            }),
        );
        expect(response.status).toBe(404);
    });

    it('it returns bad request if redirect_uri is incorrect', async () => {
        const authUrl = generateAuthorizationUrl(
            url,
            c.client_id,
            'http://bad.redirect.com',
            code_challenge,
            nonce,
            state,
        );
        const res = await app.handle(
            new Request(authUrl, {
                method: 'GET',
            }),
        );
        expect(res.status).toBe(400);
    });

    it('returns redirect to signin', async () => {
        const authUrl = generateAuthorizationUrl(
            url,
            c.client_id,
            c.redirect_uri,
            code_challenge,
            nonce,
            state,
        );
        const res = await app.handle(
            new Request(authUrl, {
                method: 'GET',
            }),
        );
        expect(res.status).toBe(302);
        expect(res.headers.get('Location')).toBe('/signin');
    });
});
