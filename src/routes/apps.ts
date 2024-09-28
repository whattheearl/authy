import Elysia, { t } from "elysia";
import { getAppById, getAppByName, getApps } from "../lib/apps";

export const appsRoute = new Elysia({ prefix: '/apps' })
  .get('/', () => getApps())
  .get(
    '/id/:id',
    ({ params: { id } }) => getAppById(id),
    { params: t.Object({ id: t.Number() }) }
  )
  .get(
    '/name/:name',
    ({ params: { name } }) => getAppByName(name),
    { params: t.Object({ name: t.String() }) }
  )
