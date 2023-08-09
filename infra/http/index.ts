import fastify, { FastifyReply } from "fastify";
import { Logger } from "@kgy/core/logger";
import { ReadBoardFn } from "@kgy/usecase/read-board";
import { BoardStore, Task } from "@kgy/core/interfaces";
import { Board } from "@kgy/core/board";
import { ErrorName } from "@kgy/core/error";

const send = <T>(reply: FastifyReply, result: T | Error) => {
  if (result instanceof Error) {
    return reply.code(500).send(result);
  } else {
    return reply.code(200).send(result);
  }
};

export const App = (props: {
  logger?: Logger;
  store: {
    board: BoardStore;
  };
}) => {
  const app = fastify({
    logger: props.logger as any, // TOOD: fix type
  });
  const readBoard = ReadBoardFn(props);
  app.get<{
    Querystring: Parameters<typeof readBoard.run>[0];
  }>("/board", async (request, reply) => {
    const iter = await readBoard.run(request.query);
    const rows: Board[] = [];
    for await (const row of iter) {
      if (row instanceof Error) return send(reply, row);
      rows.push(row);
    }
    return send(reply, rows);
  });

  app.ready(async () => {
    console.info(app.printRoutes());
  });
  return app;
};
