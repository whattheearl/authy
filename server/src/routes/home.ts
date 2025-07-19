import html from '@elysiajs/html';
import Elysia, { redirect, t } from 'elysia';
import { Session } from '$lib/session';

export const home = new Elysia().use(html()).get(
    '/',
    ({ cookie: { sess } }) => {
        console.log(sess, !sess.value);
        if (!sess.value) {
            return redirect('/signin');
        }

        const session = JSON.parse(sess.value ?? '{}') as Session;
        console.log(session);
        if (!session.user) {
            return redirect('/signin');
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
);
