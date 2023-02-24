import { Opaque } from './utils';
declare const tag = "UInt";
export type UInt = Opaque<number, typeof tag>;
export declare const UIntValidation: import("./utils").Validation<unknown, UInt, string, import("./utils").SchemaError<"E_NUMBER", unknown> | import("./utils").SchemaError<"E_UINT", unknown>>;
export declare const UIntSchema: import("./utils").Schema<"UIntSchema", number, UInt, import("./utils").SchemaError<"E_NUMBER", unknown> | import("./utils").SchemaError<"E_UINT", unknown>>;
export {};
