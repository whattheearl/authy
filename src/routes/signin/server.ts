import html from '@elysiajs/html';
import Elysia, { error, redirect, t } from 'elysia';
import page from './page';
import { getUserByUsername, getUsers } from '$data/users';
import { exportSession, Session } from '$data/session';

export const signin = new Elysia()
    .use(html())
    .get(
        '/',
        ({ html, cookie: { sess } }) => {
            if (!sess.value) {
                return html(page());
            }

            const session = JSON.parse(sess.value ?? '{}');
            if (!session.username) {
                return html(page());
            }

            return redirect('/apps');
        },
        {
            cookie: t.Optional(
                t.Cookie(
                    {
                        sess: t.Optional(t.String()),
                    },
                    {
                        httpOnly: true,
                        secure: Bun.env.cookie__secure == 'true',
                        secrets: 'dev-secret',
                    },
                ),
            ),
        },
    )
    .post(
        '/',
        async ({ body: { username, password }, cookie: { sess, oauth } }) => {
            console.log('signin', { username, password });
            // INFO: validate user and create session
            const user = getUserByUsername(username);
            console.log('retrieve user', { user });
            if (!user || !user.password || !user.username) {
                console.log('user not found')
                return error(404);
            }

            const isMatch = await Bun.password.verify(password, user.password);
            console.log('credentials are matched');
            if (!isMatch) {
                console.log('password does not match');
                return error(404);
            }
            const session = exportSession({ user_id: user.id });
            sess.value = session;
            console.log('session created', session);
            // INFO: send to app page if no previous oauth
            if (!oauth.value) {
                console.log('no oauth flow found');
                return redirect('/apps');
            }

            // INFO: construct authorization url and send if previously tried to login
            const oauthParams = JSON.parse(oauth.value) as {
                client_id: string;
                scope: string;
                response_type: string;
                code_challenge: string;
                nonce: string;
                state: string;
                redirect_uri: string;
            };
            console.log('oauth flow found', oauthParams);
            const url = new URL('http://localhost:3000/authorization');
            url.searchParams.set('client_id', oauthParams.client_id);
            url.searchParams.set('scope', oauthParams.scope);
            url.searchParams.set('response_type', oauthParams.response_type);
            url.searchParams.set('code_challenge', oauthParams.code_challenge);
            url.searchParams.set('nonce', oauthParams.nonce);
            url.searchParams.set('state', oauthParams.state);
            url.searchParams.set('redirect_uri', oauthParams.redirect_uri);
            console.log('redirecting to ', url.toString());
            return new Response('redirect', {
                status: 302,
                headers: { location: url.toString() },
            });
        },
        {
            cookie: t.Optional(
                t.Cookie(
                    {
                        sess: t.Optional(t.String()),
                        oauth: t.Optional(t.String()),
                    },
                    {
                        httpOnly: true,
                        secure: Bun.env.cookie__secure == 'true',
                        secrets: 'dev-secret',
                        sameSite: 'lax',
                    },
                ),
            ),
            body: t.Object({
                username: t.String(),
                password: t.String(),
            }),
        },
    );
