import { Opaque } from './utils';
declare const tag = "Iso8601Time";
export type Iso8601Time = Opaque<string, typeof tag>;
export declare const Iso8601TimeValidation: import("./utils").Validation<unknown, Iso8601Time, string, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<"E_ISO_8601_TIME", unknown>>;
export declare const Iso8601TimeSchema: import("./utils").Schema<"Iso8601TimeSchema", string, Iso8601Time, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<"E_ISO_8601_TIME", unknown>>;
export {};
