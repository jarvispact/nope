import { Opaque } from './utils';
declare const tag = "Int";
export type Int = Opaque<number, typeof tag>;
export declare const IntValidation: import("./utils").Validation<unknown, Int, string, import("./utils").SchemaError<"E_NUMBER", unknown> | import("./utils").SchemaError<"E_INT", unknown>>;
export declare const IntSchema: import("./utils").Schema<"IntSchema", number, Int, import("./utils").SchemaError<"E_NUMBER", unknown> | import("./utils").SchemaError<"E_INT", unknown>>;
export {};
