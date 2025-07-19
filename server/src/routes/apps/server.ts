import html from '@elysiajs/html';
import Elysia, { redirect, t } from 'elysia';
import page from './page';
import { Session } from '../../lib/session';

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
);
