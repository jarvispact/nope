import { Opaque } from './utils';
declare const tag = "Uuid";
export type Uuid = Opaque<string, typeof tag>;
export declare const UuidValidation: import("./utils").Validation<unknown, Uuid, string, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<"E_UUID", unknown>>;
export declare const UuidSchema: import("./utils").Schema<"UuidSchema", string, Uuid, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<"E_UUID", unknown>>;
export {};
