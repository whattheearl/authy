import { t } from 'elysia';

export const cookieConfig = t.Cookie(
    {
        user: t.Optional(
            t.Object({
                userId: t.String(),
                username: t.String(),
            }),
        ),
    },
    {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PRODUCTION',
        secrets:
            process.env.NODE_ENV === 'PRODUCTION'
                ? process.env.COOKIE_SECRET
                : 'dev-secret',
    },
);
