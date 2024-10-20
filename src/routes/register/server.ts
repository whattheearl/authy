import html from '@elysiajs/html';
import Elysia, { error, redirect, t } from 'elysia';
import page from './page';
import { addUser, getUserByUsername } from '$data/users';

export const register = new Elysia({ prefix: '/register' })
    .use(html())
    .get('/', ({ html }) => html(page()))
    .post(
        '/',
        async ({ body: { username, password } }) => {
            const existingUser = getUserByUsername(username);
            if (existingUser) {
                return error(409);
            }

            const hashedPassword = await Bun.password.hash(password);
            await addUser({ username, password: hashedPassword });

            return redirect('/');
        },
        {
            body: t.Object({
                username: t.String({
                    minLength: 3,
                    maxLength: 30,
                }),
                password: t.String({
                    minLength: 12,
                    maxLength: 90,
                }),
            }),
        },
    );
