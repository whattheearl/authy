import html from '@elysiajs/html';
import Elysia, { status, redirect, t } from 'elysia';
import { RegistrationPage } from '$components/registration';
import { getUserByUsername, addUser } from '$db/users';

export const registrationRoute = new Elysia({ prefix: '/registration' })
    .use(html())
    .get('/', ({ html }) => html(RegistrationPage()))
    .post(
        '/',
        async ({ body: { username, password } }) => {
            const existingUser = getUserByUsername(username);
            if (existingUser) {
                return status(409, 'username taken');
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
