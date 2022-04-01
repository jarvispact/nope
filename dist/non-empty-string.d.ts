import { Opaque } from './utils';
declare const uri = "non-empty-string";
export declare type NonEmptyString = Opaque<string, typeof uri>;
export declare const nonEmptyString: import("./utils").Schema<string, NonEmptyString, ({
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
    uri: "non-empty-string";
    code: "E_NON_EMPTY_STRING";
    message: string;
    details: {
        expectedType: "non-empty-string";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
})[], "non-empty-string">;
export declare type NonEmptyStringSchema = typeof nonEmptyString;
export {};
