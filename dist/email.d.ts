import { Opaque, SchemaError } from './utils';
declare const uri = "EmailSchema";
export declare type Email = Opaque<string, typeof uri>;
export declare const EmailSchema: import("./utils").Schema<"EmailSchema", string, Email, SchemaError<"EmailSchema", "E_EMAIL_SCHEMA", string>>;
export declare type EmailSchema = typeof EmailSchema;
export {};
