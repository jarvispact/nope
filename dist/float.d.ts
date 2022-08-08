import { Opaque, SchemaError } from './utils';
declare const uri = "float";
export declare type Float = Opaque<number, typeof uri>;
export declare const float: import("./utils").Schema<"float", number, Float, SchemaError<"float", "E_FLOAT", number>>;
export declare type FloatSchema = typeof float;
export {};
