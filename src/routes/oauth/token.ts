import Elysia, { status, NotFoundError, t } from 'elysia';
import { getCodeChallenge } from '$db/code';
import { getClientByClientId } from '$db/clients';
import { signJwt } from '$lib/jwt';
import { getUserById } from '$db/users';

export const tokenRoute = new Elysia().post(
    '/oauth/token',
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
        // TODO: validate grant type
        console.log('inside token code:', code);
        const codeChallenge = getCodeChallenge(code);
        console.log('code challenge', codeChallenge);
        if (!codeChallenge) {
            return status(401, 'invalid code_challange');
        }

        console.log('validating client');
        const client = getClientByClientId(client_id);
        if (!client || client.client_secret != client_secret) {
            return new NotFoundError('Client not found.');
        }

        console.log('validating redirect');
        if (client.redirect_uri != redirect_uri) {
            return status(400, 'invalid redirect_uri');
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
            return status(400, 'invalid code_challenge');
        }

        const access_token = await signJwt({});
        const user = getUserById(codeChallenge.user_id);
        const id_token = await signJwt({
            sub: user.id,
            username: user.username,
            email: `${user.username}@authy.wte.sh`,
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
