import swagger from '@elysiajs/swagger';
import { apps } from './routes/apps/server';
import { authorization } from './routes/authorization';
import { clients, seedClients } from './db/clients';
import { createCodeTable, dropCodeTable } from './db/code';
import { Elysia } from 'elysia';
import { home } from './routes/home';
import { jwks } from './routes/jwks';
import { openidConfiguration } from './routes/openid-configuration';
import { register } from './routes/register/server';
import { seedJwks } from './db/jwks';
import { seedUsersTable } from './db/users';
import { signin } from './routes/signin/server';
import { signout } from './routes/signout';
import { token } from './routes/token';

dropCodeTable();
createCodeTable();
if (Bun.env.NODE_ENV !== 'PRODUCTION') {
    seedClients(clients);
    seedJwks();
    await seedUsersTable();
}

const app = new Elysia();

app.use(apps) //                    /apps
    .use(authorization) //          /authorization
    .use(home) //                   /
    .use(jwks) //                   /jwks
    .use(openidConfiguration); //   /.well-known/openid-configuration
if (Bun.env.ENABLE_REGISTRATION?.toLowerCase() === 'true') {
    app.use(register); //           /register
}
app.use(signin) //                  /signin
    .use(signout); //               /signout
if (Bun.env.NODE_ENV !== 'PRODUCTION') {
    app.use(swagger()); //          /swagger
}
app.use(token); //                  /token

app.listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
