import Elysia, { t } from "elysia";

const clients = [
    {
        client_id: 'test-client',
        client_secret: 'test-client-secret',
        redirect_uris: ['http://localhost:5173/auth/callback'],
    }
];

export const authorization_endpoint = new Elysia()
    .post('/authorization_endpoint', ({
        query: {
            client_id,
            client_secret,
            redirect_uri,
            scope,
            state,
            nonce,
            response_type,
            code_challenge,
            code_challenge_method,
            login_hint
        }
    }) => {
        const client = clients.filter(c => c.client_id == client_id && c.client_secret == client_secret && c.redirect_uris.includes(redirect_uri));
        if (client.length == 0) {
            throw new Error("client not found");
        }
        console.log(client_id, client_secret)
        return { client_id, client_secret };
    }, {
        query: t.Object({
            client_id: t.String(),
            client_secret: t.String(),
            redirect_uri: t.String(),
            scope: t.Array(t.String()),
            state: t.String(),
            nonce: t.String(),
            response_type: t.String(),
            code_challenge: t.String(),
            code_challenge_method: t.String(),
            login_hint: t.Optional(t.String()),
        })
    })
