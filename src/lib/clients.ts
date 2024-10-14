import { getDb } from './utils';

export interface Client {
    id: number;
    name: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
}

export const clients = [
    {
        id: 1,
        name: 'test',
        client_id: 'test',
        client_secret: 'test-secret',
        redirect_uri: 'http://localhost:5173/auth/google/callback',
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
    const { id, name, client_id, client_secret, redirect_uri } = client;
    db.run(
        `INSERT OR REPLACE INTO clients (id, name, client_id, client_secret, redirect_uri) VALUES (?,?,?,?,?,?)`,
        [id, name, client_id, client_secret, redirect_uri],
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
