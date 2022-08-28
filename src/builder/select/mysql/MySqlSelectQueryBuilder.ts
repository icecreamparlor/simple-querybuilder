import { SelectQueryBuilder } from "../SelectQueryBuilder";
import { As, NumberSuffix, OnClause, StringSuffix } from "../../type";

export class MySqlSelectQueryBuilder<T extends readonly string[]>
  implements SelectQueryBuilder {
  private _columns: T;
  private _fromClause = "";
  private _joinClause = "";
  private _onClause = "";
  private _whereClause = "";

  private constructor() {}

  static getBuilder() {
    return new this();
  }

  select<P extends T>(columns: P) {
    this._columns = columns;

    return this as Pick<MySqlSelectQueryBuilder<P>, "from">;
  }
  from(
    tableName:
      | string
      | (<T extends readonly string[]>(
          qb: MySqlSelectQueryBuilder<T>
        ) => string)
  ) {
    // this._fromClause = tableName;
    this._fromClause =
      typeof tableName === "function"
        ? tableName(MySqlSelectQueryBuilder.getBuilder())
        : tableName;

    return this as Pick<
      MySqlSelectQueryBuilder<typeof this._columns>,
      "where" | "execute" | "innerJoin" | "leftJoin" | "rightJoin" | "getQuery"
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
    this._onClause = onClause;

    return this as Pick<
      MySqlSelectQueryBuilder<typeof this._columns>,
      "where" | "execute" | "getQuery"
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
    // this._whereClause = whereClause;

    return this as Pick<
      MySqlSelectQueryBuilder<typeof this._columns>,
      "execute" | "andWhere" | "orWhere" | "getQuery"
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
      "execute" | "andWhere" | "orWhere" | "getQuery"
    >;
  }
  orWhere(
    whereClause:
      | string
      | (<T extends readonly string[]>(
          qb: MySqlSelectQueryBuilder<T>
        ) => string)
  ) {
    this._whereClause += `
    OR (
      ${this.parseWhereClause(whereClause)}
    )
    `;

    return this as Pick<
      MySqlSelectQueryBuilder<typeof this._columns>,
      "execute" | "andWhere" | "orWhere" | "getQuery"
    >;
  }
  async execute(): Promise<
    {
      [Key in T[number] as Key extends `${string} ${As} ${infer Column}`
        ? `${Column}`
        : Key extends `${string}.${infer Column}:${NumberSuffix | StringSuffix}`
        ? `${Column}`
        : Key extends `${string}.${infer Column}`
        ? `${Column}`
        : Key extends `${infer Column}`
        ? Column
        : never]: Key extends `${string}:${NumberSuffix}`
        ? number
        : Key extends `${string}:${StringSuffix}`
        ? string
        : string;
    }
  > {
    return {} as any;
  }

  getQuery() {
    return `
SELECT ${this._columns.join(", ").trim()}
FROM ${this._fromClause.trim()}
${this._joinClause.trim()}
${!!this._whereClause.trim() ? `WHERE ${this._whereClause.trim()}` : ""}
    `.trim();
  }

  private parseWhereClause(
    whereClause:
      | string
      | (<T extends readonly string[]>(
          qb: MySqlSelectQueryBuilder<T>
        ) => string)
  ) {
    // return whereClause;
    return typeof whereClause === "function"
      ? whereClause(MySqlSelectQueryBuilder.getBuilder())
      : whereClause;
  }

  private join(joinTable: string, type: "inner" | "left" | "right") {
    this._joinClause = `${type.toUpperCase()} JOIN ${joinTable}`;

    return this as Pick<MySqlSelectQueryBuilder<typeof this._columns>, "on">;
  }
}
