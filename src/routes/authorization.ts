import Elysia, { t } from 'elysia';
import { getClientByClientId } from '../lib/clients';
import { getKey } from '../lib/keys';
import { SignHMAC, verifyHMAC } from '../lib/oidc';

export const authorization = new Elysia().get(
    '/authorization',
    async ({
        cookie: { oauth },
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
            return new Response('Client not found.', { status: 404 });
        }

        if (redirect_uri != client.redirect_uri) {
            return new Response(
                `invalid redirect_uri:${redirect_uri} expected:${client.redirect_uri}`,
                { status: 400 },
            );
        }
        
        const key = getKey();
        const jwt = oauth.value ?? '';
        const verify = await verifyHMAC(jwt, key);
        if (!verify) {
            // TODO: make secure
            oauth.httpOnly = true;
            oauth.value = await new SignHMAC({
                client_id,
                scope,
                response_type,
                code_challenge,
                nonce,
                state,
                redirect_uri,
            })
                .setIssuedAt()
                .sign(key);
            return new Response('redirecting', {
                status: 302,
                headers: { location: `/signin` },
            });
        }

        return { client_id, scope, state };
    },
    {
        cookie: t.Object({
            oauth: t.Optional(t.String()),
        }),
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
