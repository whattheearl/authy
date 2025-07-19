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
import { clients, seedClients } from '$data/clients';
import { seedJwks } from '$data/jwks';
import { seedUsersTable } from '$data/users';
import { createCodeTable, dropCodeTable } from '$data/code';

dropCodeTable();
createCodeTable();
seedClients(clients);
seedJwks();
await seedUsersTable();

const app = new Elysia();

if (Bun.env.NODE_ENV !== 'PRODUCTION') app.use(swagger());

app.use(openidConfiguration) // http://localhost:3000/.well-known/openid-configuration
    .use(jwks) // http://localhost:3000/jwks
    .use(authorization) // http://localhost:3000/authorization
    .use(signin) // http://localhost:3000/
    .use(signout) // http://localhost:3000/signout
    .use(apps) // http://localhost:3000/apps
    .use(token); // http://localhost:3000/token

if (Bun.env.ENABLE_REGISTRATION?.toLowerCase() === 'true') app.use(register); // http://localhost:3000/register

app.listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
