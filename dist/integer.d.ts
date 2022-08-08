import { Opaque, SchemaError } from './utils';
declare const uri = "integer";
export declare type Integer = Opaque<number, typeof uri>;
export declare const integer: import("./utils").Schema<"integer", number, Integer, SchemaError<"integer", "E_INTEGER">>;
export declare type IntegerSchema = typeof integer;
export {};
