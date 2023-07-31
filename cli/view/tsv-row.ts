import { chain, flow } from "lodash";

export const TsvRow = (props: {
  row: object | string;
  columns?: string[];
  truncateLength?: number;
}) => {
  const { row, columns } = props;
  const truncateLength = props.truncateLength ?? 10000;
  const toString = (value: any): string => {
    if (value === undefined) {
      return "";
    }
    if (typeof value === "string") {
      return value;
    }
    if (typeof value === "number") {
      return value.toString();
    }
    if (typeof value === "boolean") {
      return value.toString();
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (Array.isArray(value)) {
      return value.map(toString).join(",");
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return "";
  };
  const trimLongString = (value: string): string => {
    if (value.length > truncateLength)
      return value.substring(0, truncateLength) + "...";
    return value;
  };
  const replaceToSpace = (value: string): string => {
    return value.replace(/\n/g, " ").replace(/\t/g, " ");
  };
  const compose = flow([toString, trimLongString, replaceToSpace]);
  return () => {
    if (typeof row === "string") {
      return compose(row) + "\n";
    }
    return (
      columns
        ?.map((p) => chain(row).get(p).value())
        .map(compose)
        .join("\t") + "\n"
    );
  };
};
