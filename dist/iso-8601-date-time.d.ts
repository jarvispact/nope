import { Opaque } from './utils';
declare const tag = "Iso8601DateTime";
export type Iso8601DateTime = Opaque<string, typeof tag>;
export declare const Iso8601DateTimeValidation: import("./utils").Validation<unknown, Iso8601DateTime, string, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<"E_ISO_8601_DATE_TIME", unknown>>;
export declare const Iso8601DateTimeSchema: import("./utils").Schema<"Iso8601DateTimeSchema", string, Iso8601DateTime, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<"E_ISO_8601_DATE_TIME", unknown>>;
export {};
