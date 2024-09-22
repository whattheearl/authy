import { Elysia, redirect, t } from "elysia";
import { randomBytes } from "../lib/crypto";
import { OidcCookie, generateAuthorizationUrl, generateTokenUrl, getDiscoveryDocument, getTokensAsync, hashCodeChallenge } from "../lib/oauth";
import { getJwks, verifyJwt } from "../lib/jwt";
import { getClientByName } from "../db/clients";

export const authRoute = new Elysia({ prefix: 'auth' })
  .post("/signin", async () => {
    return redirect('/auth/google/signin');
  })
  .get("/:name/signin", async ({ params: { name }, cookie: { oidcCookie }, query: { redirectTo }) => {
    if (!name)
      return new Response("not found", { status: 404 });
    console.debug({ name })
    const client = getClientByName(name);
    console.debug({ client });
    if (!client)
      return new Response("not found", { status: 404 });

    const discoveryDocument = await getDiscoveryDocument(`${client.authority}/.well-known/openid-configuration`);
    console.debug(discoveryDocument);

    const state = randomBytes(32);
    const code_verifier = randomBytes(64);
    const nonce = randomBytes(64);
    const value = { state, code_verifier, nonce, redirectTo } as OidcCookie;
    oidcCookie.value = JSON.stringify(value);
    oidcCookie.httpOnly = true;
    console.debug(oidcCookie.value);

    const code_challenge = await hashCodeChallenge(code_verifier);
    console.debug({ code_challenge });
    const url = generateAuthorizationUrl(
      discoveryDocument.authorization_endpoint,
      client.client_id as string,
      client.redirect_url as string,
      code_challenge,
      nonce,
      state
    );
    console.debug(url.toString());
    return redirect(url.toString());
  }, {
    params: t.Object({ name: t.String() }),
    query: t.Object({ redirectTo: t.String() })
  })
  .get("/:name/callback", async ({ params: { name }, query: { code, state }, cookie: { oidcCookie } }) => {
    if (!name) return new Response("not found", { status: 404 });
    console.debug({ name });
    const client = getClientByName(name);
    console.debug({ client });
    if (!client)
      return new Response("not found", { status: 404 });

    const issuer = client.authority;
    const audience = client.client_id;
    const discoveryDocument = await getDiscoveryDocument(`${client.authority}/.well-known/openid-configuration`);

    const oidc = JSON.parse(oidcCookie.value as string) as OidcCookie;
    if (state != oidc.state) throw new Error('invalid state');

    const token_url = generateTokenUrl(
      discoveryDocument.token_endpoint,
      code as string,
      client.client_id,
      client.client_secret,
      client.redirect_url,
      oidc.code_verifier
    );

    const tokens = await getTokensAsync(token_url);
    console.debug({ tokens });
    const jwks = await getJwks(discoveryDocument.jwks_uri);
    console.debug({ jwks });
    const claims = await verifyJwt(jwks, tokens.id_token, {
      issuer,
      audience,
    });
    console.debug({ claims });
    if (claims.nonce != oidc.nonce) throw new Error('invalid nonce');
    const redirectTo = oidc.redirectTo ?? '/';
    console.debug(`redirecting user to ${redirectTo}`);
    return redirect(oidc.redirectTo ?? '/');

  })
  .post("/signout", () => { throw new Error("not implemented") });

