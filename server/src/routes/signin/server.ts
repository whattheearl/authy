import html from '@elysiajs/html';
import Elysia, { redirect, t, NotFoundError } from 'elysia';
import page from './page';
import { getUserByUsername } from '../../db/users';
import { exportSession, Session } from '../../lib/session';

export const signin = new Elysia()
    .use(html())
    .get(
        '/',
        ({ html, cookie: { sess } }) => {
            const enableRegistration =
                Bun.env.ENABLE_REGISTRATION?.toLowerCase() === 'true';
            console.log(sess, !sess.value);
            if (!sess.value) {
                return html(
                    page({
                        enableRegistration,
                    }),
                );
            }

            const session = JSON.parse(sess.value ?? '{}') as Session;
            console.log(session);
            if (!session.user) {
                return html(
                    page({
                        enableRegistration:
                            Bun.env.ENABLE_REGISTRATION?.toLowerCase() ===
                            'true',
                    }),
                );
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
                        secrets:
                            Bun.env.NODE_ENV === 'PRODUCTION'
                                ? Bun.env.COOKIE_SECRET
                                : 'dev-secret',
                        sameSite: 'strict',
                    },
                ),
            ),
        },
    )
    .post(
        '/',
        async ({ body: { username, password }, cookie: { sess, oauth } }) => {
            console.log('signin', { username, password });
            const user = getUserByUsername(username);
            console.log('retrieve user', { user });
            if (!user || !user.password || !user.username) {
                console.log('user not found');
                return new NotFoundError('User not found.');
            }

            const isMatch = await Bun.password.verify(password, user.password);
            console.log('credentials are matched');
            if (!isMatch) {
                console.log('password does not match');
                return new NotFoundError('User not found.');
            }

            const session = exportSession({
                user: {
                    user_id: user.id,
                    username: user.username,
                },
            });
            sess.value = session;
            console.log('session created', session);
            // INFO: send to app page no redirect found
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
                        secrets:
                            Bun.env.NODE_ENV === 'PRODUCTION'
                                ? Bun.env.COOKIE_SECRET
                                : 'dev-secret',
                        sameSite: 'strict',
                    },
                ),
            ),
            body: t.Object({
                username: t.String(),
                password: t.String(),
            }),
        },
    );
