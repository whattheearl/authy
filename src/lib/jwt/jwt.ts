import { signMessage } from '../crypto';
import { VerifyOptions, IClaims, JWKS } from './jwt.models';

// web crypto
const crypto = globalThis.crypto;

export async function getJwks(jwks_uri: string) {
  const certs = await fetch(jwks_uri);
  const jwks = await certs.json();
  console.debug('fetching jwks - jwks_uri:', jwks_uri, ' jwks:', jwks);
  return jwks as JWKS;
};

export async function verifyJwt(jwks: JWKS, token: string, options: VerifyOptions) {
  if (!token) throw new Error('token required');
  console.debug('validating token');

  const [headerEncoded, payloadEncoded, signatureEncoded] = token.split('.');
  const header = JSON.parse(Buffer.from(headerEncoded, 'base64').toString()) as { kid: string };
  const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64').toString()) as IClaims;
  console.debug('payload.header', { payload, header });

  const jwk = jwks.keys.filter((k) => k.kid == header.kid)[0];
  console.debug('jwk', { jwk });

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

  return payload as IClaims;
};

export class SignJwt {
  header = { alg: 'HS256', 'typ': 'JWT' };
  body = {};

  constructor(body: Object) {
    this.body = body;
    return this;
  }

  setIssuedAt() {
    this.body = { iat: Date.now() };
    return this;
  }

  setExpirationTime(exp: number) {
    this.body = { ...this.body, exp };
    return this;
  }

  async sign(key: CryptoKey) {
    // is this correct?
    const encHeader = Buffer.from(JSON.stringify(this.header)).toString('base64url');
    const encBody = Buffer.from(JSON.stringify(this.body)).toString('base64url');
    const signature = await signMessage(`${encHeader}.${encBody}`, key);
    const encSignature = Buffer.from(signature).toString('base64url');
    return `${encHeader}.${encBody}.${encSignature}`;
  }
}
