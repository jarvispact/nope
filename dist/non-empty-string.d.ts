import { Opaque, SchemaError } from './utils';
declare const uri = "NonEmptyStringSchema";
export declare type NonEmptyString = Opaque<string, typeof uri>;
export declare const NonEmptyStringSchema: import("./utils").Schema<"NonEmptyStringSchema", string, NonEmptyString, SchemaError<"NonEmptyStringSchema", "E_NON_EMPTY_STRING", string>>;
export declare type NonEmptyStringSchema = typeof NonEmptyStringSchema;
export {};
