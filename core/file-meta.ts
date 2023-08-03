export type FileMeta = {
  path: string;
  createdAt: Date;
};

export const FileMeta = (props: FileMeta) => {
  const { path, createdAt } = props;
  return {
    path,
    createdAt,
  };
};
