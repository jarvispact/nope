import { SchemaError } from './utils';
export declare const numberLiteral: <Literal extends number>(literal: Literal) => import("./utils").Schema<"number-literal", number, Literal, SchemaError<"number-literal", "E_NUMBER_LITERAL">>;
export declare type NumberLiteralSchema = typeof numberLiteral;
