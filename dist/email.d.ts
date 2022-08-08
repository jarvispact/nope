import { Opaque, SchemaError } from './utils';
declare const uri = "email";
export declare type Email = Opaque<string, typeof uri>;
export declare const email: import("./utils").Schema<"email", string, Email, SchemaError<"email", "E_EMAIL", string>>;
export declare type EmailSchema = typeof email;
export {};
