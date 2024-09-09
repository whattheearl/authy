import { Elysia } from "elysia";
import { clientRoute } from "./routes/clients";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
  .use(swagger())
  .use(clientRoute)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
