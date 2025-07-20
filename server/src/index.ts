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

dropCodeTable();
createCodeTable();
if (Bun.env.NODE_ENV !== 'PRODUCTION') {
    seedClients(clients);
    seedJwks();
    await seedUsersTable();
}

const app = new Elysia();

app.use(appsRoute)
    .use(authorizationRoute)
    .use(homeRoute)
    .use(jwks)
    .use(openidRoute);
if (Bun.env.ENABLE_REGISTRATION?.toLowerCase() === 'true') {
    app.use(registrationRoute);
}
app.use(signinRoute).use(signoutRoute);
if (Bun.env.NODE_ENV !== 'PRODUCTION') {
    app.use(swagger());
}
app.use(tokenRoute);

app.listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
