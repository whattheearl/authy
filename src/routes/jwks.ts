import Elysia from 'elysia';
import { getPublicJwk } from '$data/jwks';

export const jwks = new Elysia().get('/jwks', async () => {
    const keys = getPublicJwk();
    return { keys };
});
