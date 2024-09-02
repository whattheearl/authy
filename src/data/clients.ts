export interface Client {
  id: number;
  client_id: string;
  client_secret: string;
  // TODO: update to use list
  redirect_url: string;
}

export const clients = [
  {
    id: 1,
    client_id: 'first0',
    client_secret: 'first_secret',
    redirect_url: 'http://localhost:5173/local/callback'
  }
] as Client[];
