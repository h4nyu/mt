import { Storage } from "@kgy/core/interfaces";

export const CommandResultFs = (props: { storage: Storage }) => {
  const ROOT = "command-results";

  const getPath = (req: { code: string; name: string }) => {
    const { code, name } = req;
    return `${ROOT}/${code}/${name}`;
  };

  const writeStream = async (req: { code: string; name: string }) => {
    const path = getPath(req);
    return await props.storage.writeStream({ path });
  };

  return {
    writeStream,
  };
};
