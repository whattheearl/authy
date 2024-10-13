import { Elysia } from 'elysia';
import swagger from '@elysiajs/swagger';
import { staticPlugin } from '@elysiajs/static';
import { openidConfiguration } from './routes/openid-configuration';
import { jwks } from './routes/jwks';
import { authorization } from './routes/authorization';
import { keys } from './routes/keys';

const app = new Elysia()
    .use(swagger())
    .use(openidConfiguration)
    .use(jwks)
    .use(authorization)
    .use(keys)
    .use(staticPlugin({ prefix: '/' }))
    .listen(3000);
// discovery doc
// jwks
// authorization endpoint
// token endpoint
console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
