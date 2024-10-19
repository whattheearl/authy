import { getDb } from './db';

export const createTable = () => {
    const db = getDb();
    db.run(`CREATE TABLE IF NOT EXISTS jwks(
        id INTEGER PRIMARY KEY,
        private_key TEXT,
        public_key TEXT
    )`);
}

export const dropTable = () => {
    const db = getDb();
    db.run('DROP TABLE IF EXISTS jwks');
}

export const addJWKs = (private_key: string, public_key: string) => {
    const db = getDb();
    db.run(`INSERT INTO TABLE jwks (private_key, public_key) VALUES (?,?)`, [private_key, public_key]);
}

export const getJWKs = () => {
    const db = getDb();
    return db.query(`SELECT * FROM jwks`).all() as { private_key: string, public_key: string }[];
}

