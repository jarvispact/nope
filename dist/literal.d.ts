export declare const literal: <T extends string | number | boolean>(literal: T) => import("./utils").Schema<T, T, {
    uri: "literal";
    code: "E_NO_LITERAL";
    message: string;
    details: {
        expectedType: "literal";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
}, "literal">;
