import Elysia, { error, t } from 'elysia';
import { getCodeChallenge } from '$data/code-verifier';
import { getClientByClientId } from '$data/clients';
import { signJwt } from '$lib/jwt';

export const token = new Elysia({ prefix: '/token' }).post(
    '/',
    async ({
        query: {
            client_id,
            client_secret,
            code_verifier,
            code,
            grant_type,
            redirect_uri,
        },
    }) => {
        console.log('inside token code:', code);
        const codeChallenge = getCodeChallenge(code);
        console.log('code challenge', codeChallenge);
        if (!codeChallenge) {
            console.error('invalid code_challegne');
            return error(401, 'invalid code_challange');
        }

        console.log('validating client');
        const client = getClientByClientId(client_id);
        if (!client || client.client_secret != client_secret) {
            return error(404, 'client not found');
        }

        console.log('validating redirect');
        if (client.redirect_uri != redirect_uri) {
            return error(400, 'invalid redirect_uri');
        }

        console.log('validating challenge');
        const code_challenge = codeChallenge.code_challenge;
        const hashBuf = await crypto.subtle.digest(
            'SHA-256',
            Buffer.from(code_verifier),
        );

        const isMatch =
            Buffer.from(hashBuf).toString('base64url') == code_challenge;
        if (!isMatch) {
            return error(400, 'invalid code_challange');
        }

        const access_token = await signJwt({});
        const id_token = await signJwt({
            sub: '1',
            email: 'me@wte.com',
            nonce: codeChallenge.nonce,
        });
        console.log({ access_token, id_token });
        return {
            access_token,
            id_token,
        };
    },
    {
        query: t.Object({
            client_id: t.String(),
            client_secret: t.String(),
            code_verifier: t.String(),
            code: t.String(),
            grant_type: t.String(),
            redirect_uri: t.String(),
        }),
    },
);
