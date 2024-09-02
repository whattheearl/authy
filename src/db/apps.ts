import { App, apps } from '../data/apps';
import { Db } from './utils';

export const seedApps = () => {
  const db = Db();
  db.exec('DROP TABLE apps');
  db.exec(`CREATE TABLE IF NOT EXISTS apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name text,
    desc text,
    repo text
  )`);

  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    db.run('INSERT OR REPLACE INTO apps (id, name, desc, repo) VALUES (?,?,?,?)',
      [app.id, app.name, app.desc, app.repo])
  }
}

export const getApps = () => {
  const db = Db()
  const apps = db.query('SELECT * FROM apps').all();
  return apps as App[];
}

export const getAppById = (id: number) => {
  const db = Db();
  return db.query(`SELECT * FROM apps WHERE id = ?`).get(id);
}

export const getAppByName = (name: string) => {
  const db = Db();
  return db.query(`SELECT * FROM apps WHERE name = ?`).get(name);
}
