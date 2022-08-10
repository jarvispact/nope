import { SchemaError } from './utils';
export declare const LiteralSchema: <Literal extends string | number | boolean>(literal: Literal) => import("./utils").Schema<"LiteralSchema", Literal, Literal, SchemaError<"LiteralSchema", "E_LITERAL_SCHEMA", Literal>>;
export declare type LiteralSchema = typeof LiteralSchema;
