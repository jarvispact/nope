export declare const string: import("./utils").SchemaConstructor<string, string, {
    uri: "string";
    code: "E_NO_STRING";
    message: string;
    details: {
        expectedType: "string";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
}, "string">;
export declare type StringSchema = ReturnType<typeof string>;
