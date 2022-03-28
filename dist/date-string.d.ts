import { Opaque } from './utils';
declare const uri = "date-string";
export declare type DateString = Opaque<string, typeof uri>;
export declare const dateString: import("./utils").Schema<string, DateString, ({
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
    uri: "date-string";
    code: "E_NO_DATE_STRING";
    message: string;
    details: {
        expectedType: "date-string";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
})[], "date-string">;
export declare type DateStringSchema = typeof dateString;
export {};
