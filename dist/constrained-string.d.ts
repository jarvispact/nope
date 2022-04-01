import { StringSchema } from './string';
import { Opaque } from './utils';
declare const uri = "constrained-string";
export declare type ConstrainedString = Opaque<string, typeof uri>;
declare const minLengthErr: (input: StringSchema['I'], minLength: number) => {
    uri: "constrained-string";
    code: "E_CONSTRAINED_STRING_MIN_LENGTH";
    message: string;
    details: {
        expectedType: "constrained-string";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
};
declare const maxLengthErr: (input: StringSchema['I'], maxLength: number) => {
    uri: "constrained-string";
    code: "E_CONSTRAINED_STRING_MAX_LENGTH";
    message: string;
    details: {
        expectedType: "constrained-string";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
};
declare const includesErr: (input: StringSchema['I'], includes: string) => {
    uri: "constrained-string";
    code: "E_CONSTRAINED_STRING_INCLUDES";
    message: string;
    details: {
        expectedType: "constrained-string";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
};
declare const matchesErr: (input: StringSchema['I'], matches: RegExp) => {
    uri: "constrained-string";
    code: "E_CONSTRAINED_STRING_MATCHES";
    message: string;
    details: {
        expectedType: "constrained-string";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
};
declare type MinLengthError = ReturnType<typeof minLengthErr>;
declare type MaxLengthError = ReturnType<typeof maxLengthErr>;
declare type IncludesError = ReturnType<typeof includesErr>;
declare type MatchesError = ReturnType<typeof matchesErr>;
declare type Err = MinLengthError | MaxLengthError | IncludesError | MatchesError;
declare type Options = {
    minLength?: number;
    maxLength?: number;
    includes?: string;
    matches?: RegExp;
};
export declare const constrainedString: ({ minLength, maxLength, includes, matches, }?: Options) => import("./utils").Schema<string, ConstrainedString, ({
    uri: "string";
    code: "E_NO_STRING";
    message: string;
    details: {
        expectedType: "string";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
} | Err)[], "constrained-string">;
export declare type ConstrainedStringSchema = typeof constrainedString;
export {};
