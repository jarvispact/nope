import { SchemaError } from './utils';
type Primitive = string | number | boolean | symbol;
type PrimitiveOf<T extends Primitive> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T extends symbol ? symbol : unknown;
type LooseAutoComplete<T extends Primitive> = T extends boolean ? boolean : T | Omit<PrimitiveOf<T>, Exclude<T, boolean>>;
export declare const LiteralValidation: <Literal extends Primitive>(literal: Literal) => import("./utils").Validation<Literal, Literal, string, SchemaError<"E_LITERAL", {
    literal: Literal;
}>>;
export declare const LiteralSchema: <Literal extends Primitive>(literal: Literal) => import("./utils").Schema<"LiteralSchema", LooseAutoComplete<Literal>, Literal, SchemaError<"E_LITERAL", unknown>>;
export {};
