import { Database } from 'bun:sqlite';
// TODO: use env var
const DEFAULT_PATH = 'db.sqlite';

export const Db = (path: string = DEFAULT_PATH) => new Database(path);
