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
