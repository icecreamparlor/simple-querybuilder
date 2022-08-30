import { SubQuery } from "src/builder/type/SubQuery";
import { OnClause } from "../type";
import { SelectReturnType } from "../type/SelectReturnType";

export class SelectQueryBuilder<T extends readonly string[]> {
  private _columns: T = [] as any;
  private _fromClause = "";
  private _joinClause = "";
  private _whereClause = "";

  private constructor() {}

  static getBuilder() {
    return new this() as Pick<SelectQueryBuilder<any>, "select">;
  }

  select<P extends T>(columns: P): Pick<SelectQueryBuilder<P>, "from"> {
    this._columns = columns;

    return this;
  }
  from(
    tableName: string | SubQuery
  ): Pick<
    SelectQueryBuilder<T>,
    | "where"
    | "find"
    | "findOne"
    | "innerJoin"
    | "leftJoin"
    | "rightJoin"
    | "getQuery"
  > {
    this._fromClause =
      typeof tableName === "function"
        ? tableName(SelectQueryBuilder.getBuilder())
        : tableName;

    return this;
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
  on(
    onClause: OnClause
  ): Pick<SelectQueryBuilder<T>, "where" | "find" | "findOne" | "getQuery"> {
    this._joinClause += `\n ON ${onClause}`;

    return this;
  }
  where(
    whereClause: string | SubQuery
  ): Pick<
    SelectQueryBuilder<T>,
    "find" | "findOne" | "andWhere" | "orWhere" | "getQuery"
  > {
    this._whereClause += this.parseWhereClause(whereClause);

    return this;
  }
  andWhere(
    whereClause: string | SubQuery
  ): Pick<
    SelectQueryBuilder<T>,
    "find" | "findOne" | "andWhere" | "orWhere" | "getQuery"
  > {
    this._whereClause += `
    AND (
      ${this.parseWhereClause(whereClause)}
    )
    `;

    return this;
  }
  orWhere(whereClause: string | SubQuery) {
    this._whereClause += `
    OR (
      ${this.parseWhereClause(whereClause)}
    )
    `;

    return this as Pick<
      SelectQueryBuilder<typeof this._columns>,
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
      ? whereClause(SelectQueryBuilder.getBuilder())
      : whereClause;
  }

  private join(joinTable: string, type: "inner" | "left" | "right") {
    this._joinClause = `${type.toUpperCase()} JOIN ${joinTable}`;

    return this as Pick<SelectQueryBuilder<typeof this._columns>, "on">;
  }
}
