import html from '@elysiajs/html';
import Elysia, { status } from 'elysia';
import { AppsPage } from '$components/apps';
import { cookieConfig } from '$lib/cookie';

export const AppsRoute = new Elysia({ prefix: '/apps' }).use(html()).get(
    '/',
    ({ html, cookie: { user } }) => {
        if (!user.value) {
            return status(401, 'Not logged in.');
        }

        return html(
            AppsPage({
                apps: [{ name: 'some app', href: 'http://localhost:5173/' }],
            }),
        );
    },
    {
        cookie: cookieConfig,
    },
);
