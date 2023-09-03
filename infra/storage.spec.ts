import { compareAsc } from "date-fns";
import fs from "fs";
import { range } from "lodash";
import { nanoid } from "nanoid";
import { ErrorName } from "@kgy/core/error";
import { GoogleCloudStorage } from "./storage.gcs";
import { LocalStorage } from "./storage.local";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
describe("storage", () => {
  const storages = [
    // GoogleCloudStorage()
    LocalStorage({
      rootDir: "test-output",
    }),
  ];

  test.each(storages)("write and read", async (storage) => {
    const buffer = await fs.promises.readFile("test-data/Example.png", null);
    await storage.write({
      path: "aaaa.png",
      buffer,
    });
    const savedFile = await storage.read({ path: "aaaa.png" });
    if (savedFile instanceof Error) throw savedFile;
    expect(buffer.compare(savedFile)).toBe(0);
  });

  test.each(storages)("read and write by stream", async (storage) => {
    const expected = await fs.promises.readFile("package.json");
    if (expected instanceof Error) throw expected;

    const stream = fs.createReadStream("package.json", "utf8");
    const path = nanoid(3);
    const writeErr = await storage.write({ path, stream });
    if (writeErr instanceof Error) throw writeErr;
    const readStream = await storage.readStream({ path });
    if (readStream instanceof Error) throw readStream;
    const chunks: any[] = [];
    for await (const chunk of readStream) {
      chunks.push(chunk);
    }
    expect(Buffer.concat(chunks).compare(expected)).toBe(0);
  });

  test.each(storages)(
    "filter should return file not directory",
    async (storage) => {
      const now = new Date();
      const buffer = await fs.promises.readFile("package.json");

      // TODO: createdAt is before now in LocalStorage. fixme
      await sleep(100);
      const dir = nanoid(3);
      const fname = nanoid(3);
      const path = `${dir}/${fname}`;
      await storage.write({ path, buffer });
      const files = await storage.filter({ prefix: dir });
      if (files instanceof Error) throw files;
      expect(files.length).toBe(1);
      expect(files[0].path).toBe(path);
      expect(compareAsc(files[0].createdAt, now)).toBe(1);
    },
  );

  test.each(storages)(
    "filter should return empty array if directory does not exist",
    async (storage) => {
      const query = `${nanoid(3)}/${nanoid(3)}/${nanoid(3)}`;
      const files = await storage.filter({ prefix: query });
      if (files instanceof Error) {
        throw files;
      }
      expect(files.length).toBe(0);
    },
  );

  test.each(storages)("filter should return all files", async (storage) => {
    const buffer = await fs.promises.readFile("test-data/Example.png", null);
    const query = `${nanoid(3)}/${nanoid(3)}`;
    const length = 3;
    const paths = range(length).map((_) => `${query}/${nanoid()}.png`);
    for (const path of paths) {
      await storage.write({
        path,
        buffer,
      });
    }
    const files = await storage.filter({ prefix: query });
    if (files instanceof Error) throw files;
    expect(files.length).toBe(length);
  });

  test.each(storages)("exists", async (storage) => {
    const buffer = await fs.promises.readFile("test-data/Example.png", null);
    const savedPath = `${nanoid(3)}.png`;
    await storage.write({
      path: savedPath,
      buffer,
    });

    let exists = await storage.exists({ path: savedPath });
    if (exists instanceof Error) {
      throw exists;
    }
    expect(exists).toBe(true);

    exists = await storage.exists({ path: `${nanoid(3)}.png` });
    expect(exists).toBe(false);
  });

  test.each(storages)("delete and exists", async (storage) => {
    const savedFile = await fs.promises.readFile("test-data/Example.png", null);
    const path = `${nanoid()}/${nanoid()}.png`;
    const file = await storage.write({
      path,
      buffer: savedFile,
    });
    if (file instanceof Error) {
      throw file;
    }
    let isExists = await storage.exists({ path });
    expect(isExists).toBe(true);

    const rmErr = await storage.delete({ path });
    if (rmErr instanceof Error) {
      throw rmErr;
    }
    isExists = await storage.exists({ path });
    expect(isExists).toBe(false);
  });
});
