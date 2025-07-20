import { cookieConfig } from '$lib/cookie';
import Elysia, { redirect, t } from 'elysia';

export const signout = new Elysia({ prefix: 'signout' }).post(
    '/',
    ({ cookie: { sess } }) => {
        console.log(sess);
        console.log(sess.value);
        if (sess.value) sess.value = '';
        return redirect('/');
    },
    {
        cookie: cookieConfig,
    },
);
