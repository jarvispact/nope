export declare type Success<T> = {
    status: 'SUCCESS';
    value: T;
};
export declare type Failure<T> = {
    status: 'FAILURE';
    value: T;
};
export declare type Either<S, F> = Success<S> | Failure<F>;
export declare const success: <T>(v: T) => Success<T>;
export declare const failure: <T>(v: T) => Failure<T>;
export declare const err: <Uri extends string, Code extends string, Details extends {
    [Key: string]: unknown;
}>(uri: Uri, code: Code, message: string, details?: Details | undefined) => {
    uri: Uri;
    code: Code;
    message: string;
    details: Details;
};
export declare type Schema<Input, Output extends Input, Err, Uri extends string> = {
    I: Input;
    O: Output;
    E: Err;
    uri: Uri;
    is: (input: Input) => input is Output;
    create: (input: Input) => Output;
    validate: (input: Input) => Either<Output, Err>;
};
export declare type SchemaConstructor<Input, Output extends Input, Err, Uri extends string> = () => Schema<Input, Output, Err, Uri>;
export declare type CreateSchemaProps<Input, Output extends Input, Err, Uri extends string> = {
    uri: Uri;
    is: (input: Input) => input is Output;
    create: (input: Input) => Output;
    validate: (input: Input, ctx: {
        uri: Uri;
        is: (input: Input) => input is Output;
        create: (input: Input) => Output;
    }) => Either<Output, Err>;
};
export declare const createSchema: <Input, Output extends Input, Err, Uri extends string>({ uri, is, create, validate, }: CreateSchemaProps<Input, Output, Err, Uri>) => SchemaConstructor<Input, Output, Err, Uri>;
export declare const extendSchema: <S extends Schema<any, any, any, any>, Input extends S["I"], Output extends Input, Err, Uri extends string>(schema: S, { uri, is, create, validate, }: CreateSchemaProps<Input, Output, (Err | S["E"])[], Uri>) => SchemaConstructor<Input, Output, (Err | S["E"])[], Uri>;
export declare const identity: <T>(val: T) => T;
declare const tag: unique symbol;
declare type Tagged<Token> = {
    readonly [tag]: Token;
};
export declare type Opaque<Type, Token = unknown> = Type & Tagged<Token>;
export declare const objectKeys: <T extends {
    [x: string]: unknown;
}>(rec: T) => (keyof T)[];
export declare const isObject: (v: unknown) => v is Record<string, unknown>;
export declare const getErrorDetails: <T extends string>(expectedType: T, input: unknown) => {
    expectedType: T;
    providedType: string;
    providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
    providedValue: unknown;
};
export {};
