import { Opaque, SchemaError } from './utils';
declare const uri = "FloatSchema";
export declare type Float = Opaque<number, typeof uri>;
export declare const FloatSchema: import("./utils").Schema<"FloatSchema", number, Float, SchemaError<"FloatSchema", "E_FLOAT_SCHEMA", number>>;
export declare type FloatSchema = typeof FloatSchema;
export {};
