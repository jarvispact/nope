export declare const date: import("./utils").Schema<Date, Date, {
    uri: "date";
    code: "E_NO_DATE";
    message: string;
    details: {
        expectedType: "date";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
}, "date">;
export declare type DateSchema = typeof date;
