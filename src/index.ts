import { Elysia, t } from "elysia";
import swagger from "@elysiajs/swagger";
import { discoveryDoc } from "./discovery";
import { jwks } from "./jwks";
import { authorization_endpoint } from "./routes/authorization_endpoint";

const app = new Elysia()
    .use(swagger())
    .get('/.well-known/openid-configuration', () => discoveryDoc)
    .get('/jwks_uri', () => jwks) // TODO: generate jwks
    // authorization_endpoint - TODO: redirect to callback with code need to store some state?
    .use(authorization_endpoint)
    // token_endpoint - TODO: return id_token and access_token <- only needed to update idp data
    // userinfo_endpoint - TODO: return real or fake data
    // revokation_endpoint
    .listen(5173);


console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
