import fastify from "fastify";

export const App = (props: { logger: any }) => {
  const app = fastify({
    logger: props.logger,
  });
  app.get("/hello", function (request, reply) {
    console.log("aaa");
    reply.send({ hello: "world" });
  });
  app.ready(async () => {
    console.info(app.printRoutes());
  });
  return app;
};
