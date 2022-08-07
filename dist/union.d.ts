import { AutoComplete, Schema } from './utils';
export declare const union: <S extends Schema<any, any, any, any>[]>(schemaList: S) => Schema<"union", AutoComplete<S[number]["O"], S[number]["I"]>, S[number]["O"], S[number]["E"]>;
export declare type UnionSchema = typeof union;
