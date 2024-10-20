import { getDb } from './db';

export const createJwksTable = () => {
    const db = getDb();
    db.run(`CREATE TABLE IF NOT EXISTS jwks(
        id INTEGER PRIMARY KEY,
        private_key TEXT,
        public_key TEXT
    )`);
};

export const dropJwksTable = () => {
    const db = getDb();
    db.run('DROP TABLE IF EXISTS jwks');
};

export const addJwks = (private_key: string, public_key: string) => {
    const db = getDb();
    db.run(
        `INSERT OR REPLACE INTO jwks (private_key, public_key) VALUES (?,?)`,
        [private_key, public_key],
    );
};

export const getJwks = () => {
    const db = getDb();
    return db.query(`SELECT * FROM jwks`).all() as {
        id: number;
        private_key: string;
        public_key: string;
    }[];
};
