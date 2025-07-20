import html from '@elysiajs/html';
import Elysia, { status, redirect, t } from 'elysia';
import { getUserByUsername } from '$db/users';
import { cookieConfig } from '$lib/cookie';
import { SigninPage } from '$components/signin';

export const signinRoute = new Elysia()
    .use(html())
    .get(
        '/signin',
        ({ html, cookie: { user } }) => {
            const enableRegistration =
                Bun.env.ENABLE_REGISTRATION?.toLowerCase() === 'true';
            if (!user.value) {
                return html(
                    SigninPage({
                        enableRegistration,
                    }),
                );
            }
            return redirect('/apps');
        },
        {
            cookie: cookieConfig,
        },
    )
    .post(
        '/',
        async ({ body: { username, password }, cookie: { user, oauth } }) => {
            console.log('signin', { username, password });
            const exists = getUserByUsername(username);
            console.log('retrieve user', { user });
            if (!exists) {
                console.log('user not found');
                return status(404, 'User not found.');
            }

            const isMatch = await Bun.password.verify(
                password,
                exists.password,
            );
            console.log('credentials are matched');
            if (!isMatch) {
                console.log('password does not match');
                return status(404, 'User not found.');
            }

            user.value = {
                userId: exists.id,
                username: exists.username,
            };
            console.log('session created', user);
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
            cookie: cookieConfig,
            body: t.Object({
                username: t.String(),
                password: t.String(),
            }),
        },
    );
