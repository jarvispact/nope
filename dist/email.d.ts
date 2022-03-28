import { Opaque } from './utils';
declare const uri = "email";
export declare type Email = Opaque<string, typeof uri>;
export declare const email: import("./utils").Schema<string, Email, ({
    uri: "string";
    code: "E_NO_STRING";
    message: string;
    details: {
        expectedType: "string";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
} | {
    uri: "email";
    code: "E_NO_EMAIL";
    message: string;
    details: {
        expectedType: "email";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
})[], "email">;
export declare type EmailSchema = typeof email;
export {};
