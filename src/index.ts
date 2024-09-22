import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static';
import swagger from "@elysiajs/swagger";
import { clientRoute } from "./routes/clients";
import { authRoute } from "./routes/auth";
import { appsRoute } from "./routes/apps";
import { clients } from './data/clients';
import { SeedClients } from "./db/clients";

SeedClients(clients);

const app = new Elysia()
  .use(swagger())
  .use(appsRoute)
  .use(clientRoute)
  .use(authRoute)
  .use(staticPlugin({ prefix: '/' }))
  .listen(5173);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
