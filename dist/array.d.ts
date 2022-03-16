import { Schema, Either } from './utils';
declare const err: (input: unknown) => {
    uri: "array";
    code: "E_NO_ARRAY";
    message: string;
    details: {
        expectedType: "array";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
};
declare type Err = ReturnType<typeof err>;
declare type ArrayErrors<WrappedSchema extends Schema<any, any, any, any>> = {
    error: Err | null;
    items: Either<WrappedSchema['O'], WrappedSchema['E']>[];
};
export declare const array: <WrappedSchema extends Schema<any, any, any, any>>(wrappedSchema: WrappedSchema) => Schema<WrappedSchema["I"][], WrappedSchema["O"][], ArrayErrors<WrappedSchema>, "array">;
export {};
