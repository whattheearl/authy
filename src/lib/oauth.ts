// https://developer.mozilla.org/en-US/docs/Web/API/Crypto
const crypto = globalThis.crypto;

export const hashCodeChallenge = async (code_verifier: string) => {
  const hashBuf = await crypto.subtle.digest('SHA-256', Buffer.from(code_verifier));
  return Buffer.from(hashBuf).toString('base64url');
};

export const getDiscoveryDocument = async (openid_configuration_endpoint: string) => {
  const res = await fetch(openid_configuration_endpoint);
  const discoveryDoc = (await res.json()) as {
    authorization_endpoint: string;
    token_endpoint: string;
    userinfo_endpoint: string;
    issuer: string;
    jwks_uri: string;
  };
  return discoveryDoc;
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
