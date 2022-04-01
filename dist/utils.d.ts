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
export declare const isSuccess: <S, F>(either: Either<S, F>) => either is Success<S>;
export declare const isFailure: <S, F>(either: Either<S, F>) => either is Failure<F>;
export declare const createError: <Uri extends string, Code extends string, Details extends {
    [Key: string]: unknown;
}>(uri: Uri, code: Code, message: string, details?: Details) => {
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
    serialize: () => string;
};
declare type CreateSchemaPropsWithValidateFunction<Input, Output extends Input, Err, Uri extends string> = {
    uri: Uri;
    is: (input: Input) => input is Output;
    create: (input: Input) => Output;
    validate: (input: Input, ctx: {
        uri: Uri;
        is: (input: Input) => input is Output;
        create: (input: Input) => Output;
        serialize: () => string;
    }) => Either<Output, Err>;
    serialize?: () => string;
};
declare type CreateSchemaPropsWithErrorConstructor<Input, Output extends Input, Err, Uri extends string> = {
    uri: Uri;
    is: (input: Input) => input is Output;
    create: (input: Input) => Output;
    err: (input: Input) => Err;
    serialize?: () => string;
};
export declare const createSchema: <Input, Output extends Input, Err, Uri extends string>({ uri, is, create, validate, serialize, }: CreateSchemaPropsWithValidateFunction<Input, Output, Err, Uri>) => Schema<Input, Output, Err, Uri>;
declare type ArrayElement<ArrayType> = ArrayType extends readonly (infer ElementType)[] ? ElementType : ArrayType;
declare type ExtendSchemaOverload = {
    <S extends Schema<any, any, any, any>, Input extends S['I'], Output extends Input, Err, Uri extends string>(schema: S, { uri, is, create, validate, }: CreateSchemaPropsWithValidateFunction<Input, Output, Err, Uri>): Schema<Input, Output, Array<ArrayElement<Err> | ArrayElement<S['E']>>, Uri>;
    <S extends Schema<any, any, any, any>, Input extends S['I'], Output extends Input, Err, Uri extends string>(schema: S, { uri, is, create, err, }: CreateSchemaPropsWithErrorConstructor<Input, Output, Err, Uri>): Schema<Input, Output, Array<Err | ArrayElement<S['E']>>, Uri>;
};
export declare const extendSchema: ExtendSchemaOverload;
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
export declare const getDisplayType: (value: unknown) => "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "record" | "null" | "date" | "array";
export declare const getErrorDetails: <T extends string>(expectedType: T, input: unknown) => {
    expectedType: T;
    providedType: string;
    providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
    providedValue: unknown;
};
export declare const isNotNil: <T>(val: T | null | undefined) => val is T;
export {};
