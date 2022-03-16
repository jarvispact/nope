import { Opaque } from './utils';
export declare type Integer = Opaque<number, 'Integer'>;
export declare const integer: import("./utils").Schema<number, Integer, ({
    uri: "number";
    code: "E_NO_NUMBER";
    message: string;
    details: {
        expectedType: "number";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
} | {
    uri: "integer";
    code: "E_NO_INTEGER";
    message: string;
    details: {
        expectedType: "integer";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
})[], "integer">;
export declare type IntegerSchema = typeof integer;
