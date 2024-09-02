import { Elysia } from "elysia";
import { clientRoute } from "./routes/clients";

const app = new Elysia()
  .use(clientRoute)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
