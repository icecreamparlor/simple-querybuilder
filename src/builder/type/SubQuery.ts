import { MySqlSelectQueryBuilder } from "../select/mysql/MySqlSelectQueryBuilder";

export type SubQuery = <T extends readonly string[]>(
  qb: MySqlSelectQueryBuilder<T>
) => string;
