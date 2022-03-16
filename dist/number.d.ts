export declare const number: import("./utils").Schema<number, number, {
    uri: "number";
    code: "E_NO_NUMBER";
    message: string;
    details: {
        expectedType: "number";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
}, "number">;
export declare type NumberSchema = typeof number;
