import { Opaque } from './utils';
declare const uri = "uuid";
export declare type Uuid = Opaque<string, typeof uri>;
export declare const uuid: import("./utils").Schema<string, Uuid, ({
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
    uri: "uuid";
    code: "E_NO_UUID";
    message: string;
    details: {
        expectedType: "uuid";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
})[], "uuid">;
export declare type UuidSchema = typeof uuid;
export {};
