import { Opaque, SchemaError } from './utils';
declare const uri = "UuidSchema";
export declare type Uuid = Opaque<string, typeof uri>;
export declare const UuidSchema: import("./utils").Schema<"UuidSchema", string, Uuid, SchemaError<"UuidSchema", "E_UUID_SCHEMA", string>>;
export declare type UuidSchema = typeof UuidSchema;
export {};
