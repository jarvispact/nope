import { Opaque } from './utils';
declare const tag = "Email";
export type Email = Opaque<string, typeof tag>;
export declare const EmailValidation: import("./utils").Validation<unknown, Email, string, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<"E_EMAIL", unknown>>;
export declare const EmailSchema: import("./utils").Schema<"EmailSchema", string, Email, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<"E_EMAIL", unknown>>;
export {};
