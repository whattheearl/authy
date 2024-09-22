import { Client } from '../data/clients';
import { getDb } from './utils';

export function seedClients(clients: Client[]) {
  createTable();

  for (const client of clients) {
    addClient(client);
  }
}

export function createTable() {
  const db = getDb();
  db.run(`CREATE TABLE IF NOT EXISTS clients(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name  VARCHAR(255),
    authority text, 
    client_id text,
    client_secret text,
    redirect_url text
  )`);
}

export function addClient(client: Client) {
  const db = getDb();
  const { id, name, authority, client_id, client_secret, redirect_url } = client;
  db.run(
    `INSERT OR REPLACE INTO clients (id, name, authority, client_id, client_secret, redirect_url) VALUES (?,?,?,?,?,?)`,
    [id, name, authority, client_id, client_secret, redirect_url]
  );
}

export function getClients() {
  const db = getDb();
  return db.query(`SELECT * FROM clients`).all() as Client[];
}

export function getClientById(id: number) {
  const db = getDb();
  const client = db.query(`SELECT * FROM clients WHERE id = ?`).get(id);
  if (!client) return null;
  return client as Client;
}

export function getClientByName(name: string) {
  const db = db();
  const client = db.query('SELECT * FROM clients WHERE name = ?').get(name);
  if (!client) return null;
  return client as Client;
}

export function getClientByClientId(client_id: string) {
  const db = getDb();
  const client = db.query(`SELECT * FROM clients WHERE client_id = ?`).get(client_id);
  if (!client) return null;
  return client as Client;
}

