import { Elysia } from 'elysia';
import { Database } from 'bun:sqlite';

export const client = new Elysia()
  .get('/', () => {
    const db = new Database('/db.sqlite');

  })
