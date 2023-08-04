import { Storage } from "@google-cloud/storage";
import { toInteger } from "lodash";
import { Storage as IStorage } from "@kgy/core/interfaces";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { FileMeta } from "@kgy/core/file-meta";
import { Err, ErrorName } from "@kgy/core/error";
import { Logger } from "@kgy/core/logger";

export const GoogleCloudStorage = (props?: {
  bucketName?: string;
  maxFileSize?: number;
  logger?: Logger;
}) => {
  const bucketName = props?.bucketName ?? process.env.BUCKET_NAME;
  if (!bucketName) {
    throw Err({
      name: ErrorName.ConfigError,
      message: `bucketName is not set. It is required to use FirebaseStorage`,
    });
  }
  const maxFileSize =
    props?.maxFileSize ||
    toInteger(process.env.MAX_FILE_SIZE) ||
    30 * 1024 * 1024; //default: 30MB
  const storage = (() => {
    if (
      process.env.STORAGE_EMULATOR_HOST &&
      process.env.ENVIROMENT === "local"
    ) {
      return new Storage({
        apiEndpoint: `http://${process.env.FIREBASE_STORAGE_EMULATOR_HOST}`,
      });
    }
    return new Storage();
  })();
  props?.logger?.info(`Storage.maxFileSize: ${maxFileSize}`);

  const handleError = (err: any): Error => {
    // EPIPE: Broken pipe (write):
    // A write on a pipe, socket, or FIFO for which there is no process to read the data. Commonly encountered at the net and http layers, indicative that the remote side of the stream being written to has been closed
    if (err.message?.toLowerCase().includes("network")) {
      return Err({
        name: ErrorName.RetryableError,
        message: err.toString(),
        prev: err,
      });
    }
    if (err.message?.toLowerCase().includes("epipe")) {
      return Err({
        name: ErrorName.RetryableError,
        message: err.toString(),
        prev: err,
      });
    }
    if (err instanceof Error && err.message.toLowerCase().includes("timeout")) {
      return Err({
        name: ErrorName.RetryableError,
        message: err.toString(),
        prev: err,
      });
    }
    if (err instanceof Error && err.message.toLowerCase().includes("hang up")) {
      return Err({
        name: ErrorName.RetryableError,
        message: err.toString(),
        prev: err,
      });
    }
    if (
      err instanceof Error &&
      err.message.toLowerCase().includes("service unavailable")
    ) {
      return Err({
        name: ErrorName.RetryableError,
        message: err.toString(),
        prev: err,
      });
    }
    if (err.message?.includes("try again")) {
      return Err({
        name: ErrorName.RetryableError,
        message: err.toString(),
        prev: err,
      });
    }
    // FIXME: This is a workaround for the problem that err.message is empty when the error is thrown by `new ApiError`.
    if (err.stack?.includes("new ApiError") && err.message === "") {
      return Err({
        name: ErrorName.RetryableError,
        message: err.toString(),
        prev: err,
      });
    }
    if (err.message?.includes("EPIPE")) {
      return Err({
        name: ErrorName.RetryableError,
        message: err.toString(),
        prev: err,
      });
    }
    return err;
  };

  const exists = async (req): Promise<boolean | Error> => {
    const { path } = req;
    try {
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(path);
      const [exists] = await file.exists();
      return exists;
    } catch (e) {
      return handleError(e);
    }
  };

  const filter = async (req): Promise<FileMeta[] | Error> => {
    const { prefix } = req;
    try {
      const bucket = storage.bucket(bucketName);
      const [files, _] = await bucket.getFiles({
        prefix,
      });
      return files
        .filter((x) => {
          return x.metadata.size > 0;
        })
        .map((x) => {
          return FileMeta({
            path: x.name,
            createdAt: new Date(x.metadata.timeCreated),
          });
        });
    } catch (e) {
      return handleError(e);
    }
  };

  const delete_ = async (req): Promise<void | Error> => {
    const { path } = req;
    const isExists = await exists(req);
    if (isExists === false) {
      return;
    }
    try {
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(req);
      await file.delete();
    } catch (e) {
      return handleError(e);
    }
  };
  const read: IStorage["read"] = async (req) => {
    const { path } = req;
    const stream = await readStream({ path });
    if (stream instanceof Error) return stream;
    try {
      let buf = Buffer.from("");
      return await new Promise((resolve, reject) => {
        stream.on("data", (nextData) => {
          buf = Buffer.concat([buf, nextData]);
        });
        stream.on("error", function (err) {
          reject(err);
        });
        stream.on("finish", function () {
          resolve(buf);
        });
      });
    } catch (e) {
      return handleError(e);
    }
  };

  const readStream = async (req: { path: string }) => {
    const { path } = req;
    const prev = await exists(path);
    if (prev instanceof Error) {
      return prev;
    }
    if (!prev) {
      return Err({
        name: ErrorName.NotFound,
        message: `File ${path} not found`,
      });
    }
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(path);
    const [meta] = await file.getMetadata();
    const fileSize = toInteger(meta.size);
    return file.createReadStream({
      validation: false,
    });
  };

  const writeStream = async (req: { path: string }) => {
    try {
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(req.path);
      return file.createWriteStream({
        resumable: false,
        validation: "md5",
      });
    } catch (e) {
      return handleError(e);
    }
  };

  const write: IStorage["write"] = async (req) => {
    const { path } = req;
    try {
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(path);
      const ws = await writeStream({
        path,
      });
      if (ws instanceof Error) return ws;
      if ("buffer" in req) {
        await pipeline(Readable.from(req.buffer), ws);
      }
      if ("stream" in req) {
        await pipeline(req.stream, ws);
      }
      return Err({
        name: ErrorName.InvalidArgument,
        message: `Either buffer or stream must be specified`,
      });
    } catch (e) {
      return handleError(e);
    }
  };
  return {
    filter,
    exists,
    readStream,
    writeStream,
    write,
    read,
    delete: delete_,
    handleError,
  };
};
