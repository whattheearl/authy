import html from '@elysiajs/html';
import Elysia, { redirect } from 'elysia';
import { cookieConfig } from '$lib/cookie';

export const homeRoute = new Elysia().use(html()).get(
    '/',
    ({ cookie: { user } }) => {
        if (!user.value) {
            return redirect('/signin');
        }

        return redirect('/apps');
    },
    {
        cookie: cookieConfig,
    },
);
