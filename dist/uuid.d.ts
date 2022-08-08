import { Opaque, SchemaError } from './utils';
declare const uri = "uuid";
export declare type Uuid = Opaque<string, typeof uri>;
export declare const uuid: import("./utils").Schema<"uuid", string, Uuid, SchemaError<"uuid", "E_UUID">>;
export declare type UuidSchema = typeof uuid;
export {};
