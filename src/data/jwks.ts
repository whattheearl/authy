import { getDb } from './db';
import * as jose from 'jose';

export const seedJwks = async () => {
    createJwksTable();
    const jwks = getJwks();
    if (jwks.length == 0) {
        const keyPair = await jose.generateKeyPair('PS256', {
            extractable: true,
        });
        const private_key = await jose.exportJWK(keyPair.privateKey);
        const public_key = await jose.exportJWK(keyPair.publicKey);
        console.log({ private_key, public_key });
        addJwks(JSON.stringify(private_key), JSON.stringify(public_key));
    }
};

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

export const getPublicJwk = () => {
    const jwks = getJwks();
    const keys = jwks.map((keyPair) => ({
        kid: keyPair.id,
        ...JSON.parse(keyPair.public_key),
    }));
    return keys;
};

export const getPrivateJwk = async () => {
    try {
        const jwks = getJwks();
        if (jwks.length == 0) {
            return null;
        }

        const keyTxt = jwks.map((j) => j.private_key)[0];
        console.log({ keyTxt });
        const keyObj = JSON.parse(keyTxt);
        console.log({ keyObj });
        const privateKey = await jose.importJWK(keyObj, 'PS256');
        return privateKey;
    } catch (err) {
        console.error('unable to retrive private key');
    }
};

