import { Elysia, t } from 'elysia';
import { getClientByClientId, getClientById, getClients } from '../lib/clients';

export const clientRoute = new Elysia({ prefix: '/clients' })
    .get('/', () => {
        console.log();
        const clients = getClients();
        return { clients };
    })
    .get(
        '/id/:id',
        ({ params: { id } }) => {
            const client = getClientById(id);
            return { client };
        },
        {
            params: t.Object({ id: t.Number() }),
        },
    )
    .get(
        '/name/:name',
        ({ params: { clientId } }) => {
            const client = getClientByClientId(clientId);
            return { client };
        },
        {
            params: t.Object({ clientId: t.String() }),
        },
    );
