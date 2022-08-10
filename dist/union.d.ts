import { Schema, SchemaError } from './utils';
export declare const UnionSchema: <S extends Schema<any, any, any, any>[]>(schemaList: S) => Schema<"UnionSchema", S[number]["I"], S[number]["O"], SchemaError<"UnionSchema", "E_UNION_SCHEMA", S[number]["I"]>>;
export declare type UnionSchema = typeof UnionSchema;
