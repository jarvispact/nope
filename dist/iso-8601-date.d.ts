import { Opaque } from './utils';
declare const tag = "Iso8601Date";
export type Iso8601Date = Opaque<string, typeof tag>;
export declare const Iso8601DateValidation: import("./utils").Validation<unknown, Iso8601Date, string, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<"E_ISO_8601_DATE", unknown>>;
export declare const Iso8601DateSchema: import("./utils").Schema<"Iso8601DateSchema", string, Iso8601Date, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<"E_ISO_8601_DATE", unknown>>;
export {};
