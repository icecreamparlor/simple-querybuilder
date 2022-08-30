import { MySqlSelectQueryBuilder } from "../select/mysql/MySqlSelectQueryBuilder";

export type SubQuery = (
  qb: Pick<MySqlSelectQueryBuilder<any>, "select">
) => string;
