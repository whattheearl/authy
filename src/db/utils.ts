import { env } from 'bun';
import { Database } from 'bun:sqlite';
const DEFAULT_PATH = env.DB_PATH ?? 'db.sqlite';

export const getDb = (path: string = DEFAULT_PATH) => new Database(path);
