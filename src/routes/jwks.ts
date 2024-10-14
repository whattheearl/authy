import Elysia from 'elysia';
import { getPublicJwks } from '../lib/jwks';

export const jwks = new Elysia().get('/jwks', async () => {
    const keys = await getPublicJwks();
    return { keys };
});
