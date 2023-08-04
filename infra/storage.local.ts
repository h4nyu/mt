import fs from "fs";
import pathLib from "path";
import { Err, ErrorName } from "@kgy/core/error";
import { FileMeta } from "@kgy/core/file-meta";
import { Storage } from "@kgy/core/interfaces";
import { pipeline } from "stream/promises";

export const LocalStorage = (props?: {
  rootDir?: string;
  maxFileSize?: number;
}) => {
  const maxFileSize = props?.maxFileSize;
  const rootDir = pathLib.resolve(
    props?.rootDir || process.env.STORAGE_DIR || ".",
  );
  const localDir = (x: string) => pathLib.join(rootDir, x);
  const removePrefix = (x: string) => x.slice(rootDir.length + 1);
  const write: Storage["write"] = async (req) => {
    const { path } = req;
    const localPath = localDir(path);
    try {
      await fs.promises.mkdir(pathLib.dirname(localDir(path)), {
        recursive: true,
      });
      if ("buffer" in req) {
        await fs.promises.writeFile(localPath, req.buffer);
        return;
      }
      if ("stream" in req) {
        await pipeline(req.stream, fs.createWriteStream(localPath));
      }
    } catch (err) {
      return err as Error;
    }
    return;
  };

  const writeStream: Storage["writeStream"] = async (req) => {
    const { path } = req;
    const localPath = localDir(path);
    try {
      await fs.promises.mkdir(pathLib.dirname(localDir(path)), {
        recursive: true,
      });
      return fs.createWriteStream(localPath);
    } catch (err) {
      return err as Error;
    }
  };

  const exists = async (req: { path: string }): Promise<boolean | Error> => {
    const { path } = req;
    try {
      const stats = await fs.promises.stat(localDir(path));
      return stats.isFile();
    } catch (err) {
      if ((err as { code: string }).code == "ENOENT") {
        return false;
      }
      return Err({
        name: ErrorName.UnknownError,
        message: (err as Error).message,
      });
    }
  };

  const filter = async (req: {
    prefix: string;
  }): Promise<FileMeta[] | Error> => {
    const { prefix } = req;
    const filterRecursive = async (dir: string, files: FileMeta[] = []) => {
      const paths = await fs.promises.readdir(dir);
      const dirs: string[] = [];
      for (const path of paths) {
        const stats = await fs.promises.stat(`${dir}/${path}`);
        if (stats.isDirectory()) {
          dirs.push(pathLib.join(dir, path));
        } else {
          files.push(
            FileMeta({
              path: pathLib.join(dir, path),
              createdAt: stats.ctime,
            }),
          );
        }
      }
      for (const d of dirs) {
        files = await filterRecursive(d, files);
      }
      return files;
    };
    try {
      const query = localDir(prefix);
      const dirname = query.endsWith("/") ? query : pathLib.dirname(query);
      const candidates = await filterRecursive(dirname);
      const files = candidates
        .filter((x) => x.path.startsWith(query))
        .map((x) => FileMeta({ ...x, path: removePrefix(x.path) }));
      return files;
    } catch (err) {
      if ((err as { code: string }).code == "ENOENT") {
        return [];
      }
      return Err({
        name: ErrorName.UnknownError,
        message: (err as Error).message,
      });
    }
  };
  const stat: Storage["stat"] = async (req) => {
    const { path } = req;
    const localPath = localDir(path);
    try {
      return await fs.promises.stat(localPath);
    } catch (err) {
      return err as Error;
    }
  };
  const read = async (req: { path: string }): Promise<Buffer | Error> => {
    const { path } = req;
    const localPath = localDir(path);
    try {
      const stat = await fs.promises.stat(localPath);
      const fileSize = stat.size;
      if (maxFileSize && maxFileSize < fileSize) {
        return Err({
          name: ErrorName.UnknownError,
          message: `File size ${fileSize} bytes is larger than max size ${maxFileSize} bytes`,
        });
      }
      return await fs.promises.readFile(localPath, null);
    } catch (err) {
      if ((err as { code: string }).code == "ENOENT") {
        return Err({
          name: ErrorName.NotFound,
          message: `File ${path} not found`,
        });
      }
      return Err({
        name: ErrorName.UnknownError,
        message: (err as Error).message,
      });
    }
  };
  const readStream: Storage["readStream"] = (req: { path: string }) => {
    const { path } = req;
    const localPath = localDir(path);
    return fs.createReadStream(localPath);
  };

  const delete_ = async (req: { path: string }): Promise<void | Error> => {
    const { path } = req;
    const isExists = await exists({ path });
    if (isExists === false) {
      return;
    }
    try {
      const localPath = localDir(path);
      await fs.promises.rm(localPath, { recursive: true });
    } catch (err) {
      if ((err as { code: string }).code == "ENOENT") {
        return;
      }
      return Err({
        name: ErrorName.UnknownError,
        message: (err as Error).message,
      });
    }
    return;
  };
  return {
    filter,
    exists,
    read,
    readStream,
    write,
    writeStream,
    stat,
    delete: delete_,
    rootDir,
  };
};
