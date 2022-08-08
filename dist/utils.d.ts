export declare const objectKeys: <T extends {
    [x: string]: unknown;
}>(rec: T) => (keyof T)[];
export declare const isRecord: (v: unknown) => v is Record<string, unknown>;
export declare type AutoComplete<T extends U, U = string> = T | (U & {
    _TS_AUTOCOMPLETE_?: never;
});
export declare type Infer<T extends Schema<any, any, any, any>> = T['O'];
export declare type Valid<T> = {
    status: 'VALID';
    value: T;
};
export declare type Invalid<T> = {
    status: 'INVALID';
    value: T;
};
export declare type Either<S, F> = Valid<S> | Invalid<F>;
export declare const valid: <T>(v: T) => Valid<T>;
export declare const invalid: <T>(v: T) => Invalid<T>;
export declare const valueOf: <S, F>(either: Either<S, F>) => S | F;
export declare const isValid: <S, F>(either: Either<S, F>) => either is Valid<S>;
export declare const isInvalid: <S, F>(either: Either<S, F>) => either is Invalid<F>;
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
declare type ErrContext<Uri extends string> = {
    uri: Uri;
    displayString: string;
};
declare type ValidateContext<Uri extends string, I, O extends I, E> = {
    uri: Uri;
    displayString: string;
    is: (input: I) => input is O;
    err: (input: I) => E;
};
declare type SchemaArgs<Uri extends string, I, O extends I, E> = {
    uri: Uri;
    displayString?: string;
    is: (input: I) => boolean;
    err: (input: I, ctx: ErrContext<Uri>) => E;
    validate?: (input: I, ctx: ValidateContext<Uri, I, O, E>) => Either<O, E>;
};
export declare type Schema<Uri extends string, I, O extends I, E> = {
    uri: Uri;
    displayString: string;
    I: I;
    O: O;
    E: E;
    is: (input: I) => input is O;
    err: (input: I) => E;
    validate: (input: I) => Either<O, E>;
};
export declare const schema: <Uri extends string, I, O extends I, E>({ uri, displayString, is, err, validate, }: SchemaArgs<Uri, I, O, E>) => Schema<Uri, I, O, E>;
export {};
