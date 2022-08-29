import { SelectQueryBuilder } from "../SelectQueryBuilder";
import { As, NumberSuffix, OnClause, StringSuffix } from "../../type";

export class MySqlSelectQueryBuilder<T extends readonly string[]>
  implements SelectQueryBuilder {
  private _columns: T;
  private _fromClause = "";
  private _joinClause = "";
  // private _onClause = "";
  private _whereClause = "";

  private constructor() {}

  static getBuilder<T extends readonly string[]>() {
    return new this() as Pick<MySqlSelectQueryBuilder<T>, "select">;
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
      "find" | "findOne" | "andWhere" | "orWhere" | "getQuery"
    >;
  }

  async find(): Promise<
    {
      [Key in T[number] as Key extends  // ColumnName As C:number
      `${string} ${As} ${infer Column}:${NumberSuffix | StringSuffix}`
        ? `${Column}`
        : // C.ColumnName:number
        Key extends `${string}.${infer Column}:${NumberSuffix | StringSuffix}`
        ? `${Column}`
        : Key extends  // ColumnName AS C
          `${string} ${As} ${infer Column}`
        ? `${Column}`
        : // ColumnName:number
        Key extends `${infer Column}:${NumberSuffix | StringSuffix}`
        ? `${Column}`
        : // C.ColumnName
        Key extends `${string}.${infer Column}`
        ? `${Column}`
        : // ColumnName
        Key extends `${infer Column}`
        ? Column
        : never]: Key extends  // // ColumnName AS CN
      `${string}:${NumberSuffix}`
        ? number
        : Key extends `${string}:${StringSuffix}`
        ? string
        : string;
    }[]
  > {
    return [] as any;
  }

  async findOne(): Promise<
    {
      [Key in T[number] as Key extends  // ColumnName As C:number
      `${string} ${As} ${infer Column}:${NumberSuffix | StringSuffix}`
        ? `${Column}`
        : // C.ColumnName:number
        Key extends `${string}.${infer Column}:${NumberSuffix | StringSuffix}`
        ? `${Column}`
        : Key extends  // ColumnName AS C
          `${string} ${As} ${infer Column}`
        ? `${Column}`
        : // ColumnName:number
        Key extends `${infer Column}:${NumberSuffix | StringSuffix}`
        ? `${Column}`
        : // C.ColumnName
        Key extends `${string}.${infer Column}`
        ? `${Column}`
        : // ColumnName
        Key extends `${infer Column}`
        ? Column
        : never]: Key extends  // // ColumnName AS CN
      `${string}:${NumberSuffix}`
        ? number
        : Key extends `${string}:${StringSuffix}`
        ? string
        : string;
    }
  > {
    return {} as any;
  }

  getQuery() {
    //     return `
    // SELECT ${this._columns.join(", ").trim()}
    // FROM ${this._fromClause.trim()}
    // ${this._joinClause.trim()}
    // ${!!this._whereClause.trim() ? `WHERE ${this._whereClause.trim()}` : ""}
    //     `.trim();
    return [
      `SELECT ${this._columns.join(", ").trim()}`,
      `FROM ${this._fromClause.trim()}`,
      this._joinClause.trim(),
      this._whereClause ? `WHERE ${this._whereClause}` : "",
    ].join("\n");
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
