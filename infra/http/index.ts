import fastify from "fastify";
import { Logger } from "@kgy/core/logger";

export const App = (props?: { logger?: Logger }) => {
  const app = fastify();
  app.get("/hello", function (request, reply) {
    reply.send({ hello: "world" });
  });
  app.ready(async () => {
    console.info(app.printRoutes());
  });
  return app;
};
