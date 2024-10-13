import Elysia from 'elysia';

export const jwks = new Elysia().get('/jwks', () => {
    throw new Error("not implemented")
    return [{}];
});
