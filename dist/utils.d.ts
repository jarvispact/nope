export declare const objectKeys: <T extends {
    [x: string]: unknown;
}>(rec: T) => (keyof T)[];
export declare const isObject: (v: unknown) => v is Record<string, unknown>;
export declare type AutoComplete<T extends U, U = string> = T | (U & {
    _TS_AUTOCOMPLETE_?: never;
});
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
declare const tag: unique symbol;
declare type Tagged<Token> = {
    readonly [tag]: Token;
};
export declare type Opaque<Type, Token = unknown> = Type & Tagged<Token>;
export declare type SchemaError<Uri extends string, Code extends string> = {
    uri: Uri;
    code: Code;
    message: string;
};
export declare const createError: <Uri extends string, Code extends string>(uri: Uri, code: Code, message: string) => SchemaError<Uri, Code>;
declare type ValidateContext<Uri extends string, I, O extends I> = {
    uri: Uri;
    is: (input: I) => input is O;
};
declare type SchemaArgs<Uri extends string, I, O extends I, E> = {
    uri: Uri;
    is: (input: I) => boolean;
    validate: (input: I, ctx: ValidateContext<Uri, I, O>) => Either<O, E>;
};
export declare type Schema<Uri extends string, I, O extends I, E> = {
    uri: Uri;
    I: I;
    O: O;
    E: E;
    is: (input: I) => input is O;
    validate: (input: I) => Either<O, E>;
};
export declare const schema: <Uri extends string, I, O extends I, E>({ uri, is, validate, }: SchemaArgs<Uri, I, O, E>) => Schema<Uri, I, O, E>;
export {};
