import { clients, Client } from '../data/clients';
import { Db } from './utils';

export const seedClients = () => {
  const db = Db();
  db.run(`CREATE TABLE IF NOT EXISTS clients(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id text,
    client_secret text
  )`);

  for (let i = 0; i < clients.length; i++) {
    const client = clients[i];
    db.run(`INSERT OR REPLACE INTO clients (id, client_id, client_secret) VALUES (?,?,?)`,
      [client.id, client.client_id, client.client_secret]);
  }
}

export const getClients = () => {
  const db = Db();
  return db.query(`SELECT * FROM clients`).all() as Client[];
}

export const getClientById = (id: number) => {
  const db = Db();
  const client = db.query(`SELECT * FROM clients WHERE id = ?`).get(id);
  if (!client) return null;
  return client as Client;
}

export const getClientByClientId = (client_id: string) => {
  const db = Db();
  const client = db.query(`SELECT * FROM clients WHERE client_id = ?`).get(client_id);
  if (!client) return null;
  return client as Client;
}

seedClients();
