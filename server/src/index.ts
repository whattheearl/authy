import { Elysia } from 'elysia';
import swagger from '@elysiajs/swagger';
import { openidConfiguration } from './routes/openid-configuration';
import { jwks } from './routes/jwks';
import { authorization } from './routes/authorization';
import { signin } from './routes/signin/server';
import { signout } from './routes/signout';
import { register } from './routes/register/server';
import { apps } from './routes/apps/server';
import { token } from './routes/token';
import { clients, seedClients } from './db/clients';
import { seedJwks } from './db/jwks';
import { seedUsersTable } from './db/users';
import { createCodeTable, dropCodeTable } from './db/code';

dropCodeTable();
createCodeTable();

if (Bun.env.NODE_ENV !== 'PRODUCTION') {
    seedClients(clients);
    seedJwks();
    await seedUsersTable();
}

const app = new Elysia();

if (Bun.env.NODE_ENV !== 'PRODUCTION') app.use(swagger());

app.use(openidConfiguration) // /.well-known/openid-configuration
    .use(jwks) // /jwks
    .use(authorization) // /authorization
    .use(signin) // /
    .use(signout) // /signout
    .use(apps) // /apps
    .use(token); // /token

if (Bun.env.ENABLE_REGISTRATION?.toLowerCase() === 'true') app.use(register); // http://localhost:3000/register

app.listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
