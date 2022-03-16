export declare const boolean: import("./utils").Schema<boolean, boolean, {
    uri: "boolean";
    code: "E_NO_BOOLEAN";
    message: string;
    details: {
        expectedType: "boolean";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
}, "boolean">;
export declare type BooleanSchema = typeof boolean;
