import fastify from "fastify";

export const App = (props: { logger: any }) => {
  const app = fastify({
    http2: true,
  });
  return app;
};
