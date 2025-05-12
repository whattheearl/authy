import { getDb } from './_core';

const db = getDb();

export const createCodeTable = () => {
    db.run(`CREATE TABLE IF NOT EXISTS code(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        code VARCHAR(255),
        code_challenge VARCHAR(255),
        nonce VARCHAR(255)
    )`);
};

export const dropCodeTable = () => {
    db.run('DROP TABLE IF EXISTS code');
};

export interface AddCodeChallenge {
    code: string;
    code_challenge: string;
    nonce: string;
    user_id: number;
}

export const addCodeChallenge = (codeChallenge: AddCodeChallenge) => {
    try {
        db.run(
            'INSERT INTO code (code, code_challenge, nonce, user_id) VALUES (?,?,?,?)',
            [
                codeChallenge.code,
                codeChallenge.code_challenge,
                codeChallenge.nonce,
                codeChallenge.user_id,
            ],
        );
    } catch (err) {
        console.error('unable to add code challenge', codeChallenge, err);
    }
};

export function removeCodeChallenge(code: string) {
    db.run('DELETE FROM code WHERE code = ?', [code]);
}

export interface CodeChallenge {
    id: number;
    code: string;
    code_challenge: string;
    nonce: string;
    user_id: number;
}

export function getCodeChallenge(code: string) {
    return db
        .query('SELECT * FROM code WHERE code = ?')
        .get(code) as CodeChallenge;
}
