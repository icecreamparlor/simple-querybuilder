import { SubQuery } from "src/builder/type/SubQuery";
import { OnClause } from "../../type";
import { SelectReturnType } from "../../type/SelectReturnType";
import { SelectQueryBuilder } from "../SelectQueryBuilder";

export class MySqlSelectQueryBuilder<T extends readonly string[]>
  implements SelectQueryBuilder
{
  private _columns: T;
  private _fromClause = "";
  private _joinClause = "";
  // private _onClause = "";
  private _whereClause = "";

  private constructor() {}

  static getBuilder() {
    return new this() as Pick<MySqlSelectQueryBuilder<any>, "select">;
  }

  select<P extends T>(columns: P) {
    this._columns = columns;

    return this as Pick<MySqlSelectQueryBuilder<P>, "from">;
  }
  from(tableName: string | SubQuery) {
    this._fromClause =
      typeof tableName === "function"
        ? tableName(MySqlSelectQueryBuilder.getBuilder())
        : tableName;

    return this as Pick<
      MySqlSelectQueryBuilder<typeof this._columns>,
      | "where"
      | "find"
      | "findOne"
      | "innerJoin"
      | "leftJoin"
      | "rightJoin"
      | "getQuery"
    >;
  }
  innerJoin(joinTable: string) {
    return this.join(joinTable, "inner");
  }
  leftJoin(joinTable: string) {
    return this.join(joinTable, "left");
  }
  rightJoin(joinTable: string) {
    return this.join(joinTable, "right");
  }
  on(onClause: OnClause) {
    this._joinClause += `\n ON ${onClause}`;

    return this as Pick<
      MySqlSelectQueryBuilder<typeof this._columns>,
      "where" | "find" | "findOne" | "getQuery"
    >;
  }
  where(
    whereClause:
      | string
      | (<T extends readonly string[]>(
          qb: MySqlSelectQueryBuilder<T>
        ) => string)
  ) {
    this._whereClause += this.parseWhereClause(whereClause);

    return this as Pick<
      MySqlSelectQueryBuilder<typeof this._columns>,
      "find" | "findOne" | "andWhere" | "orWhere" | "getQuery"
    >;
  }
  andWhere(
    whereClause:
      | string
      | (<T extends readonly string[]>(
          qb: MySqlSelectQueryBuilder<T>
        ) => string)
  ) {
    this._whereClause += `
    AND (
      ${this.parseWhereClause(whereClause)}
    )
    `;

    return this as Pick<
      MySqlSelectQueryBuilder<typeof this._columns>,
      "find" | "findOne" | "andWhere" | "orWhere" | "getQuery"
    >;
  }
  orWhere(whereClause: string | SubQuery) {
    this._whereClause += `
    OR (
      ${this.parseWhereClause(whereClause)}
    )
    `;

    return this as Pick<
      MySqlSelectQueryBuilder<typeof this._columns>,
      "find" | "findOne" | "andWhere" | "orWhere" | "getQuery"
    >;
  }

  async find(): Promise<SelectReturnType<T>[]> {
    return [] as any;
  }

  async findOne(): Promise<SelectReturnType<T>> {
    return {} as any;
  }

  getQuery() {
    return [
      `SELECT ${this._columns.join(", ").trim()}`,
      `FROM ${this._fromClause.trim()}`,
      this._joinClause.trim(),
      this._whereClause ? `WHERE ${this._whereClause}` : "",
    ].join("\n");
  }

  private parseWhereClause(whereClause: string | SubQuery) {
    return typeof whereClause === "function"
      ? whereClause(MySqlSelectQueryBuilder.getBuilder())
      : whereClause;
  }

  private join(joinTable: string, type: "inner" | "left" | "right") {
    this._joinClause = `${type.toUpperCase()} JOIN ${joinTable}`;

    return this as Pick<MySqlSelectQueryBuilder<typeof this._columns>, "on">;
  }
}
