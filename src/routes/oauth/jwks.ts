import Elysia from 'elysia';
import { getPublicJwk } from '$db/jwks';

export const jwks = new Elysia().get('/oauth/jwks', async () => {
    const keys = getPublicJwk();
    return { keys };
});
