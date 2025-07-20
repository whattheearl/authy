import html from '@elysiajs/html';
import Elysia, { redirect, t } from 'elysia';
import { Session } from '$lib/session';
import { cookieConfig } from '$lib/cookie';

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
        cookie: cookieConfig,
    },
);
