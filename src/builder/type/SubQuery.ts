import { SelectQueryBuilder } from "../select/SelectQueryBuilder";

export type SubQuery = (qb: Pick<SelectQueryBuilder<any>, "select">) => string;
