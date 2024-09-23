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
