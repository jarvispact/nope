import { Schema, Either } from './utils';
declare const errNoRecord: (input: unknown) => {
    uri: "record";
    code: "E_NO_RECORD";
    message: string;
    details: {
        expectedType: "record";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
};
declare type ErrNoRecord = ReturnType<typeof errNoRecord>;
declare const errMissingProperties: (input: unknown, requiredProperties: string[]) => {
    uri: "record";
    code: "E_MISSING_RECORD_PROPERTIES";
    message: string;
    details: {
        requiredProperties: string[];
        expectedType: "record";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
};
declare type ErrMissingProperties = ReturnType<typeof errMissingProperties>;
declare const errUnexpectedProperties: (input: unknown, requiredProperties: string[]) => {
    uri: "record";
    code: "E_UNEXPECTED_RECORD_PROPERTIES";
    message: string;
    details: {
        requiredProperties: string[];
        expectedType: "record";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
};
declare type ErrUnexpectedProperties = ReturnType<typeof errUnexpectedProperties>;
declare type RecordErrors<Definition extends {
    [Key: string]: Schema<any, any, any, any>;
}> = {
    error: ErrNoRecord | ErrMissingProperties | ErrUnexpectedProperties | null;
    properties: {
        [K in keyof Definition]: Either<Definition[K]['O'], Definition[K]['E']>;
    } | null;
};
declare type FromDefinition<Definition extends {
    [Key: string]: Schema<any, any, any, any>;
}, T extends 'I' | 'O' | 'E'> = {
    [K in keyof Definition]: Definition[K][T];
};
export declare const record: <Definition extends {
    [Key: string]: Schema<any, any, any, any>;
}>(definition: Definition) => Schema<FromDefinition<Definition, "I">, FromDefinition<Definition, "O">, RecordErrors<Definition>, "record">;
export {};
