import { SchemaError } from './utils';
export declare const stringLiteral: <Literal extends string>(literal: Literal) => import("./utils").Schema<"string-literal", string, Literal, SchemaError<"string-literal", "E_STRING_LITERAL">>;
export declare type StringLiteralSchema = typeof stringLiteral;
