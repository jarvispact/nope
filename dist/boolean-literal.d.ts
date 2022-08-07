import { SchemaError } from './utils';
export declare const booleanLiteral: <Literal extends boolean>(literal: Literal) => import("./utils").Schema<"boolean-literal", boolean, Literal, SchemaError<"boolean-literal", "E_BOOLEAN_LITERAL">>;
export declare type BooleanLiteralSchema = typeof booleanLiteral;
