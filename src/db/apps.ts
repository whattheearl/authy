import { App, apps } from '../data/apps';
import { getDb } from './utils';

export function seedApps(apps: App[]) {
  const db = getDb();
  db.exec('DROP TABLE apps');
  db.exec(`CREATE TABLE IF NOT EXISTS apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name text,
    desc text,
    repo text
  )`);

  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    const { id, name, description, repo } = app;
    db.run('INSERT OR REPLACE INTO apps (id, name, desc, repo) VALUES (?,?,?,?)',
      [id, name, description, repo])
  }
}

export function getApps() {
  const db = getDb();
  const apps = db.query('SELECT * FROM apps').all();
  return apps as App[];
}

export function getAppById(id: number) {
  const db = getDb();
  return db.query(`SELECT * FROM apps WHERE id = ?`).get(id);
}

export function getAppByName(name: string) {
  const db = getDb();
  return db.query(`SELECT * FROM apps WHERE name = ?`).get(name);
}
