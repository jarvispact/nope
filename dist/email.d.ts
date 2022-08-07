import { Opaque, SchemaError } from './utils';
export declare type Email = Opaque<string, 'Email'>;
export declare const email: import("./utils").Schema<"email", string, Email, SchemaError<"email", "E_EMAIL">>;
export declare type EmailSchema = typeof email;
