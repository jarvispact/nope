import { Schema, Either } from './utils';
declare const errNoRecord: (input: unknown, humanReadableType: string) => {
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
    code: "E_RECORD_MISSING_PROPERTIES";
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
    code: "E_RECORD_UNEXPECTED_PROPERTIES";
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
declare type RequiredPart<Definition extends {
    [Key: string]: Schema<any, any, any, any>;
}, T extends 'I' | 'O' | 'E', OptionalKeys extends keyof Definition> = {
    [K in OptionalKeys]: Definition[K][T];
};
declare type OptionalPart<Definition extends {
    [Key: string]: Schema<any, any, any, any>;
}, T extends 'I' | 'O' | 'E', OptionalKeys extends keyof Definition> = {
    [K in OptionalKeys]?: Definition[K][T];
};
declare type FromDefinition<Definition extends {
    [Key: string]: Schema<any, any, any, any>;
}, T extends 'I' | 'O' | 'E', RequiredKey extends keyof Definition, OptionalKey extends keyof Definition = keyof Definition> = RequiredPart<Definition, T, RequiredKey> & OptionalPart<Definition, T, OptionalKey>;
export declare const record: <Definition extends {
    [Key: string]: Schema<any, any, any, any>;
}, RequiredKey extends keyof Definition>(definition: Definition, options?: {
    requiredProperties?: RequiredKey[] | undefined;
}) => Schema<FromDefinition<Definition, "I", RequiredKey, keyof Definition>, FromDefinition<Definition, "O", RequiredKey, keyof Definition>, RecordErrors<Definition>, "record">;
export {};
