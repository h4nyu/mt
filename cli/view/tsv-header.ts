export const TsvHeader = (props: { columns?: string[] }) => {
  return () => {
    return props.columns ? props.columns.join("\t") + "\n" : "";
  };
};
