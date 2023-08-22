import { Storage } from "@kgy/core/interfaces";

export const CommandResultFs = (props: { 
  storage: Storage,
  root?: string,
}) => {
  const ROOT = props.root ?? "command-result";

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
