import { getDb } from './_core';

export interface User {
    id: number;
    username: string;
    password: string;
}

const db = getDb();

export const dropUsersTable = () => {
    db.run(`DROP TABLE IF EXISTS users`);
}

export const createUsersTable = () => {
    db.run(`CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(30),
        password VARCHAR(255)
    )`);
}

export const seedUsersTable = async () =>  {
    createUsersTable();
    const user = {
        id: 0,
        username: 'testtesttest',
        password: 'testtesttest',
    } as User;
    const password = await Bun.password.hash(user.password);
    db.run(`INSERT OR REPLACE INTO users (id, username, password) VALUES (?,?,?)`, [user.id, user.username, password]);
}

export const addUser = async (user: User) => {
    const password = await Bun.password.hash(user.password);
    if (user.id) {
        db.run('INSERT INTO users (id, username, password) VALUES (?,?,?)', [user.id, user.username, password]);
        return;
    } 
    db.run('INSERT INTO users (username, password) VALUES (?,?)', [user.username, password]);
}

export const getUsers = () => {
    const users = db.query('SELECT * FROM users').all() as User[];
    return users;
};

export const getUserByUsername = (username: string) => {
    try {
        return db.query('SELECT * FROM users WHERE username = ?').get(username) as User;
    } catch (err) {
        console.log('unable to retrieve user from db', err)
        return null;
    }
};
