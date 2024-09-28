import { Elysia, redirect, t } from "elysia";
import { randomBytes } from "../lib/oidc";
import { OidcCookie, generateAuthorizationUrl, generateTokenUrl, getDiscoveryDocument, getTokensAsync, hashCodeChallenge, getJwks, verifyOauthJwt, SignHMAC, importHMAC, verifyHMAC } from "../lib/oidc";
import { getClientByName } from "../lib/clients";
import { tempKey } from "./key";

export const authRoute = new Elysia({ prefix: 'auth' })
  .post('/signin', ({ body: { clientName,  } }) => { return { clientName } },
    { body: t.Object({ clientName: t.String(), })}
  )
  .get("/:name/signin", async ({ params: { name }, cookie: { oidcCookie }, query: { redirectTo } }) => {
    console.debug('client.name: ', { name })
    if (!name)
      return new Response("not found", { status: 404 });

    const client = getClientByName(name);
    console.debug('client: ',{ client });
    if (!client)
      return new Response("not found", { status: 404 });

    const discoveryDocument = await getDiscoveryDocument(`${client.authority}/.well-known/openid-configuration`);
    console.debug(discoveryDocument);

    const state = randomBytes(32);
    const code_verifier = randomBytes(64);
    const nonce = randomBytes(64);
    const value = { state, code_verifier, nonce, redirectTo: redirectTo } as OidcCookie;
    oidcCookie.value = JSON.stringify(value);
    oidcCookie.httpOnly = true;
    console.debug('oidcCookie: ', oidcCookie.value);

    const code_challenge = await hashCodeChallenge(code_verifier);
    console.debug('code_challange: ', { code_challenge });
    const url = generateAuthorizationUrl(
      discoveryDocument.authorization_endpoint,
      client.client_id as string,
      client.redirect_url as string,
      code_challenge,
      nonce,
      state
    );
    console.debug('redirectUrl: ', url.toString());
    return redirect(url.toString());
  }, {
    params: t.Object({ name: t.String() }),
    query: t.Object({ redirectTo: t.Optional(t.String()) })
  })
  .get("/:name/callback", async ({ params: { name }, query: { code, state }, cookie: { oidcCookie, sid } }) => {
    if (!name) return new Response("not found", { status: 404 });
    console.debug('client.name: ', { name });
    const client = getClientByName(name);
    console.debug('client: ', { client });
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
    console.debug('tokens: ', { tokens });
    const jwks = await getJwks(discoveryDocument.jwks_uri);
    console.debug('jwks: ',{ jwks });
    const claims = await verifyOauthJwt(jwks, tokens.id_token, {
      issuer,
      audience,
    });
    console.debug('claims: ', { claims });
    if (claims.nonce != oidc.nonce) throw new Error('invalid nonce');
    const redirectTo = oidc.redirectTo ?? '/';
    console.debug('redirectTo: ', { redirectTo });
    const user = { id: 1, email: claims.email, name: `${claims.given_name} ${claims.family_name}`};
    
    const key = await importHMAC(tempKey);
    const jwt = await new SignHMAC(user)
      .setIssuedAt()
      .sign(key);

    console.debug('jwt:', jwt);
    sid.value = jwt;

    return redirect(oidc.redirectTo ?? '/auth/claims');
  })
  .get('/claims', async ({ cookie: { sid } }) => {
    console.log('sid:', sid.value);
    const key = await importHMAC(tempKey);
    console.debug('key:', key);
    const verify = await verifyHMAC(sid.value, key);
    console.debug('verify:', verify)
    if(!verify)
      return 'invalid sid';
    
    const body = sid.value!.split('.')[1];
    return Buffer.from(body, 'base64url').toString('utf8');
  },{
    cookie: t.Object({ sid: t.String() })
  })
  .post("/signout", () => { throw new Error("not implemented") });

