import { env } from 'bun';

export interface Client {
  id: number;
  name: string;
  authority: string;
  client_id: string;
  client_secret: string;
  redirect_url: string;
}

export const clients = [
  {
    id: 1,
    name: 'test',
    authority: 'https://wte.sh',
    client_id: 'first0',
    client_secret: 'first_secret',
    redirect_url: 'http://localhost:5173/local/callback'
  },
  {
    id: 2,
    name: 'google',
    authority: env.OIDC_GOOGLE_AUTHORITY as string,
    client_id: env.OIDC_GOOGLE_CLIENTID as string,
    client_secret: env.OIDC_GOOGLE_CLIENTSECRET as string,
    redirect_url: env.OIDC_GOOGLE_REDIRECTURL as string,
  }
] as Client[];
