export type As = "AS" | "as" | "As" | "aS";
export type NumberSuffix = "Number" | "number";
export type StringSuffix = "String" | "string";
export type ColumnTypeSuffix = NumberSuffix | StringSuffix;
export type SelectColumnClause =
  | `${string} AS ${string}`
  | `${string}.${string}`;
export type OnClause = `${string}=${string}`;
