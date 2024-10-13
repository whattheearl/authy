import Elysia from 'elysia';
import { getExportedKeys } from '../lib/keys';

export const keys = new Elysia().get('/keys', async () => {
    return getExportedKeys();
});
