import html from '@elysiajs/html';
import Elysia, { redirect, t } from 'elysia';
import page from './page';
import { Session } from '../../lib/session';
import { cookieConfig } from '$lib/cookie';

export const apps = new Elysia({ prefix: '/apps' }).use(html()).get(
    '/',
    ({ html, cookie: { sess } }) => {
        console.log('hey');
        console.log(sess);
        if (!sess.value) {
            return redirect('/');
        }
        const session = JSON.parse(sess.value ?? '{}') as Session;
        console.log({ session });
        if (!session.user) {
            return redirect('/');
        }

        return html(
            page({
                apps: [{ name: 'some app', href: 'http://localhost:5173/' }],
            }),
        );
    },
    {
        cookie: cookieConfig,
    },
);
