import { SchemaError } from './utils';
export declare const literal: <Literal extends string | number | boolean>(literal: Literal) => import("./utils").Schema<"literal", Literal, Literal, SchemaError<"literal", "E_LITERAL", Literal>>;
export declare type LiteralSchema = typeof literal;
