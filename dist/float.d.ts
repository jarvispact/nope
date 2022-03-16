import { Opaque } from './utils';
export declare type Float = Opaque<number, 'Float'>;
export declare const float: import("./utils").Schema<number, Float, ({
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
    uri: "float";
    code: "E_NO_FLOAT";
    message: string;
    details: {
        expectedType: "float";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
})[], "float">;
export declare type FloatSchema = typeof float;
