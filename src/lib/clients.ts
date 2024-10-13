import { getDb } from './utils';
import { env } from 'bun';

export interface Client {
    id: number;
    name: string;
    authority: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
}

export const clients = [
    {
        id: 1,
        name: 'test',
        authority: 'https://wte.sh',
        client_id: 'first0',
        client_secret: 'first_secret',
        redirect_uri: 'http://localhost:5173/auth/google/callback',
    },
    {
        id: 2,
        name: 'google',
        authority: env.OIDC_GOOGLE_AUTHORITY as string,
        client_id: env.OIDC_GOOGLE_CLIENTID as string,
        client_secret: env.OIDC_GOOGLE_CLIENTSECRET as string,
        redirect_uri: env.OIDC_GOOGLE_REDIRECTURL as string,
    },
] as Client[];

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
    name  VARCHAR(30),
    authority text, 
    client_id text,
    client_secret text,
    redirect_uri text
  )`);
}

export function dropTable() {
    const db = getDb();
    db.run(`DROP TABLE clients`);
}

export function addClient(client: Client) {
    const db = getDb();
    const { id, name, authority, client_id, client_secret, redirect_uri } =
        client;
    db.run(
        `INSERT OR REPLACE INTO clients (id, name, authority, client_id, client_secret, redirect_uri) VALUES (?,?,?,?,?,?)`,
        [id, name, authority, client_id, client_secret, redirect_uri],
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
    const db = getDb();
    const client = db.query('SELECT * FROM clients WHERE name = ?').get(name);
    if (!client) return null;
    return client as Client;
}

export function getClientByClientId(client_id: string) {
    const db = getDb();
    const client = db
        .query(`SELECT * FROM clients WHERE client_id = ?`)
        .get(client_id);
    if (!client) return null;
    return client as Client;
}
