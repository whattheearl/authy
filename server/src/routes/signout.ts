import { cookieConfig } from '$lib/cookie';
import Elysia, { redirect } from 'elysia';

export const signoutRoute = new Elysia({ prefix: 'signout' }).post(
    '/',
    ({ cookie: { user } }) => {
        console.log('logging out', user);
        user.remove();
        return redirect('/');
    },
    {
        cookie: cookieConfig,
    },
);
