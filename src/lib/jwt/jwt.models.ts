export interface VerifyOptions {
  issuer: string;
  audience: string;
}

export interface IClaims {
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

export interface JWK extends JsonWebKey {
  kid: string;
}

export interface JWKS {
  keys: JWK[];
}
