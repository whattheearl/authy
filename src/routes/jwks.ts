import Elysia from 'elysia';
import { getPublicJwks } from '$data/jwks';

export const jwks = new Elysia().get('/jwks', async () => {
    const keys = await getPublicJwks();
    return { keys };
});
