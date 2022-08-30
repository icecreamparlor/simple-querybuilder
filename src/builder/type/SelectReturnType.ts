import { As, NumberSuffix, StringSuffix } from "./SqlClause";

export type SelectReturnType<T extends readonly string[]> = {
  [Key in T[number] as Key extends  // ColumnName As C:number
  `${string} ${As} ${infer Column}:${NumberSuffix | StringSuffix}${string}`
    ? `${Column}`
    : // C.ColumnName:number
    Key extends `${string}.${infer Column}:${
        | NumberSuffix
        | StringSuffix}${string}`
    ? `${Column}`
    : // ColumnName:number
    Key extends `${infer Column}:${NumberSuffix | StringSuffix}${string}`
    ? `${Column}`
    : Key extends  // ColumnName AS C
      `${string} ${As} ${infer Column}`
    ? `${Column}`
    : // C.ColumnName
    Key extends `${string}.${infer Column}`
    ? `${Column}`
    : // ColumnName
    Key extends `${infer Column}`
    ? Column
    : never]: Key extends `${string}:${NumberSuffix}?`
    ? number | undefined
    : Key extends `${string}:${NumberSuffix}`
    ? number
    : Key extends `${string}:${StringSuffix}?`
    ? string | undefined
    : Key extends `${string}:${StringSuffix}`
    ? string
    : string;
};
