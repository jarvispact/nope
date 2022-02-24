import { Opaque } from './utils';
declare type Email = Opaque<string, 'Email'>;
export declare const createEmail: (input: string) => Email;
export declare const email: import("./utils").SchemaConstructor<string, Email, ({
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
export {};
