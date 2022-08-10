import { Opaque, SchemaError } from './utils';
declare const uri = "IntegerSchema";
export declare type Integer = Opaque<number, typeof uri>;
export declare const IntegerSchema: import("./utils").Schema<"IntegerSchema", number, Integer, SchemaError<"IntegerSchema", "E_INTEGER_SCHEMA", number>>;
export declare type IntegerSchema = typeof IntegerSchema;
export {};
