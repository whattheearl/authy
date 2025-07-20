import swagger from '@elysiajs/swagger';
import { appsRoute } from './routes/apps';
import { authorizationRoute } from './routes/authorization';
import { clients, seedClients } from './db/clients';
import { createCodeTable, dropCodeTable } from './db/code';
import { Elysia } from 'elysia';
import { homeRoute } from './routes/home';
import { jwks } from './routes/jwks';
import { openidRoute } from './routes/openid-configuration';
import { registrationRoute } from './routes/registration';
import { seedJwks } from './db/jwks';
import { seedUsersTable } from './db/users';
import { signinRoute } from './routes/signin';
import { signoutRoute } from './routes/signout';
import { tokenRoute } from './routes/token';

export async function RunDatabaseMigrations() {
    dropCodeTable();
    createCodeTable();
    seedClients(clients);
    seedJwks();
    await seedUsersTable();
}

export const app = new Elysia()
    .use(appsRoute)
    .use(authorizationRoute)
    .use(homeRoute)
    .use(jwks)
    .use(openidRoute)
    .use(registrationRoute)
    .use(signinRoute)
    .use(signoutRoute)
    .use(swagger())
    .use(tokenRoute);

export function StartServer() {
    app.listen(3000);
    console.log(
        `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );
}
