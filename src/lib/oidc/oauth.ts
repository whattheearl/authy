// https://developer.mozilla.org/en-US/docs/Web/API/Crypto
const crypto = globalThis.crypto;

export const hashCodeChallenge = async (code_verifier: string) => {
  const hashBuf = await crypto.subtle.digest('SHA-256', Buffer.from(code_verifier));
  return Buffer.from(hashBuf).toString('base64url');
};

export interface DiscoveryDoc {
    authorization_endpoint: string;
    token_endpoint: string;
    userinfo_endpoint: string;
    issuer: string;
    jwks_uri: string;
}

export const getDiscoveryDocument = async (openid_configuration_endpoint: string) => {
  const res = await fetch(openid_configuration_endpoint);
  const discoveryDoc = (await res.json()) as {
    authorization_endpoint: string;
    token_endpoint: string;
    userinfo_endpoint: string;
    issuer: string;
    jwks_uri: string;
  };
  return discoveryDoc as DiscoveryDoc;
};

export const generateAuthorizationUrl = (
  authorization_endpoint: string,
  client_id: string,
  redirect_uri: string,
  code_challenge: string,
  nonce: string,
  state: string
) => {
  const endpoint = new URL(authorization_endpoint);
  endpoint.searchParams.append('client_id', client_id);
  endpoint.searchParams.append('scope', 'email openid profile');
  endpoint.searchParams.append('redirect_uri', redirect_uri);
  endpoint.searchParams.append('response_type', 'code');
  endpoint.searchParams.append('code_challenge', code_challenge);
  endpoint.searchParams.append('code_challenge_method', 'S256');
  endpoint.searchParams.append('nonce', nonce);
  endpoint.searchParams.append('state', state);
  console.debug('generateAuthorizationUrl', endpoint);
  return endpoint.toString();
};

export const generateTokenUrl = (
  token_endpoint: string,
  code: string,
  client_id: string,
  client_secret: string,
  redirect_uri: string,
  code_verifier: string
) => {
  const endpoint = new URL(token_endpoint);
  endpoint.searchParams.append('code', code);
  endpoint.searchParams.append('client_id', client_id as string);
  endpoint.searchParams.append('client_secret', client_secret as string);
  endpoint.searchParams.append('redirect_uri', redirect_uri as string);
  endpoint.searchParams.append('grant_type', 'authorization_code');
  endpoint.searchParams.append('code_verifier', code_verifier);
  console.debug('generateTokenUrl', endpoint);
  return endpoint.toString();
};

export const getTokensAsync = async (token_uri: string) => {
  const res = await fetch(token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  if (res.status != 200) {
    console.error('getTokensAsync response', await res.text());
    throw new Error('Unable to retrieve token');
  }

  const data = await res.json();
  console.debug('token response', { data });
  const { access_token, id_token } = data;
  return { access_token, id_token };
};

export interface OidcCookie {
  state: string;
  code_verifier: string;
  nonce: string;
  redirectTo: string;
}

export interface JWK extends JsonWebKey {
  kid: string;
}

export interface JWKResponse {
  keys: JWK[]
}

export async function getJwks(jwks_uri: string) {
  const certs = await fetch(jwks_uri);
  const jwks = await certs.json();
  console.debug('jwks_uri:', jwks_uri, ' jwks:', jwks);
  return jwks as JWKResponse[];
};

export interface VerifyOptions {
  issuer: string;
  audience: string;
}

export interface Claims {
  iss: string;
  sub: string;
  aud: string;
  given_name: string;
  family_name: string;
  email: string;
  email_verified: boolean;
  picture: string;
  nonce: string;
  iat: number;
  exp: number;
}

export async function verifyOauthJwt(jwks: JWKResponse, token: string, options: VerifyOptions) {
  if (!token) throw new Error('token required');
  console.debug('validating token');

  const [headerEncoded, payloadEncoded, signatureEncoded] = token.split('.');
  const header = JSON.parse(Buffer.from(headerEncoded, 'base64').toString()) as { kid: string };
  const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64').toString()) as Claims;
  console.debug('payload.header', { payload, header });
  console.log({jwks})

  const jwk = jwks.keys.filter((k) => k.kid == header.kid)[0];
  console.debug('jwk', JSON.stringify({ jwk }));
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' } //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    false,
    ['verify']
  );

  console.debug('now verify', { signatureEncoded, payload });
  const isValidSignature = await crypto.subtle.verify(
    {
      name: 'RSASSA-PKCS1-v1_5'
    },
    publicKey,
    Buffer.from(signatureEncoded, 'base64url'),
    Buffer.from(`${headerEncoded}.${payloadEncoded}`)
  );

  console.debug(isValidSignature);
  if (!isValidSignature) throw new Error(`invalid signature`);

  if (options.audience && options.audience != payload.aud)
    throw new Error(`audience does not match [${options.audience}] [${payload.aud}]`);

  if (options.issuer && options.issuer != payload.iss)
    throw new Error(`issuer does not match [${options.issuer}] [${payload.iss}]`);

  const { exp } = payload;
  const now = Math.floor(Date.now() / 1000);
  if (exp - now < 0) throw new Error(`token expired [${exp}] [${now}]`);

  const { iat } = payload;
  if (now - iat < 0) throw new Error(`token not valid yet [${iat}] [${now}]`);

  return payload as Claims;
};
