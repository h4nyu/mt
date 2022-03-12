import postgresql from 'postgres';

export const Postgresql = (props?: { url?: string; max?: number }) => {
  const url =
    props?.url ?? process.env.DATABASE_URL ?? 'postgres://localhost:5432';
  const max = props?.max ?? 10;
  return postgresql(url, { max });
};
