import { getDb } from './db';

export interface User {
    id: number;
    username: string;
    password: string;
}

export interface UserCreate {
    username: string;
    password: string;
}

const db = getDb();

export const dropUsersTable = () => {
    db.run(`DROP TABLE IF EXISTS users`);
};

export const createUsersTable = () => {
    db.run(`CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(30),
        password VARCHAR(255)
    )`);
};

export const seedUsersTable = async () => {
    createUsersTable();
    const user = {
        id: 0,
        username: 'testtesttest',
        password: 'testtesttest',
    } as User;
    await importUser(user);
};

export const addUser = async (u: UserCreate) => {
    const password = await Bun.password.hash(u.password);
    db.run('INSERT INTO users (username, password) VALUES (?,?)', [
        u.username,
        password,
    ]);
};

export const importUser = async (u: User) => {
    const password = await Bun.password.hash(u.password);
    db.run(
        'INSERT OR IGNORE INTO users (id, username, password) VALUES (?,?,?)',
        [u.id, u.username, password],
    );
};

export const getUsers = () => {
    const users = db.query('SELECT * FROM users').all() as User[];
    return users;
};

export const getUserById = (id: number) => {
    return db.query('SELECT * FROM users WHERE id = ?').get(id) as User;
};

export const getUserByUsername = (username: string) => {
    try {
        return db
            .query('SELECT * FROM users WHERE username = ?')
            .get(username) as User;
    } catch (err) {
        console.log('unable to retrieve user from db', err);
        return null;
    }
};
