import swagger from '@elysiajs/swagger';
import { authorizationRoute } from './routes/oauth/authorization';
import { clients, seedClients } from './db/clients';
import { createCodeTable, dropCodeTable } from './db/code';
import { dashboardRoute as dashboardRoute } from './routes/dashboard';
import { Elysia } from 'elysia';
import { jwks } from './routes/oauth/jwks';
import { openidRoute } from './routes/oauth/openid-configuration';
import { registrationRoute } from './routes/registradion';
import { rootRoute } from './routes/root';
import { seedJwks } from './db/jwks';
import { seedUsersTable } from './db/users';
import { signinRoute } from './routes/signin';
import { signoutRoute } from './routes/signout';
import { tokenRoute } from './routes/oauth/token';

export async function RunDatabaseMigrations() {
    dropCodeTable();
    createCodeTable();
    seedClients(clients);
    seedJwks();
    await seedUsersTable();
}

export const app = new Elysia();

app.use(swagger());

app.use(dashboardRoute)
    .use(registrationRoute)
    .use(rootRoute)
    .use(signinRoute)
    .use(signoutRoute);

app.use(authorizationRoute).use(jwks).use(openidRoute).use(tokenRoute);

export function StartServer() {
    app.listen(process.env.PORT || 3000);
    console.log(
        `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );
}
