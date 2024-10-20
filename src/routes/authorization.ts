import Elysia, { t } from 'elysia';
import { getClientByClientId } from '$data/clients';
import { randomBytes } from '$lib/utils';
import { AddCodeChallenge, addCodeChallenge } from '$data/code';
import { importSession } from '$data/session';

export const authorization = new Elysia().get(
    '/authorization',
    async ({
        cookie: { oauth, sess },
        query: {
            client_id,
            scope,
            response_type,
            code_challenge,
            nonce,
            state,
            redirect_uri,
        },
    }) => {
        const client = getClientByClientId(client_id);
        if (!client) {
            console.error('no client');
            return new Response('Client not found.', { status: 404 });
        }
        console.log('client found', client);

        if (redirect_uri != client.redirect_uri) {
            console.error('miss mathch redirect');
            return new Response(
                `invalid redirect_uri:${redirect_uri} expected:${client.redirect_uri}`,
                { status: 400 },
            );
        }
        console.debug('redirect_uri is valid', redirect_uri);

        // TODO: validate scope
        console.log('session.value', sess.value);
        const session = importSession(sess.value);
        console.log('session', session);
        if (!session) {
            console.log('no user session');
            oauth.value = JSON.stringify({
                client_id,
                scope,
                response_type,
                code_challenge,
                nonce,
                state,
                redirect_uri,
            });
            return new Response('redirecting', {
                status: 302,
                headers: { location: `/` },
            });
        }
        const url = new URL(redirect_uri);
        console.log('constructing redirect_uri');
        const codeChallenge = {
            user_id: session.user_id,
            code: randomBytes(32),
            code_challenge,
            nonce,
        } as AddCodeChallenge;
        addCodeChallenge(codeChallenge);
        url.searchParams.set('code', codeChallenge.code);
        url.searchParams.set('state', state);
        return new Response('redirect', {
            status: 302,
            headers: { location: url.toString() },
        });
    },
    {
        cookie: t.Cookie(
            {
                sess: t.Optional(t.String()),
                oauth: t.Optional(t.String()),
            },
            {
                secure: Bun.env.NODE_ENV == 'PRODUCTION',
                httpOnly: true,
                secrets: 'dev-secret',
            },
        ),
        query: t.Object({
            client_id: t.String(),
            scope: t.String(),
            response_type: t.String(),
            code_challenge: t.String(),
            nonce: t.String(),
            state: t.String(),
            redirect_uri: t.String(),
        }),
    },
);
