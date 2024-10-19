import Elysia from 'elysia';
import { getPublicKeys } from '$lib/jwt';

export const jwks = new Elysia().get('/jwks', async () => {
    const keys = await getPublicKeys();
    return { keys };
});
