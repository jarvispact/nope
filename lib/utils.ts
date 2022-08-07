export const objectKeys = <T extends { [x: string]: unknown }>(rec: T) =>
    Object.keys(rec) as Array<keyof T>;

export const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' &&
    !Array.isArray(v) &&
    v !== null &&
    !(v instanceof Date);

export type AutoComplete<T extends U, U = string> =
    | T
    | (U & { _TS_AUTOCOMPLETE_?: never });

export type Success<T> = { status: 'SUCCESS'; value: T };
export type Failure<T> = { status: 'FAILURE'; value: T };
export type Either<S, F> = Success<S> | Failure<F>;

export const success = <T>(v: T): Success<T> => {
    return {
        status: 'SUCCESS',
        value: v,
    };
};

export const failure = <T>(v: T): Failure<T> => {
    return {
        status: 'FAILURE',
        value: v,
    };
};

export const isSuccess = <S, F>(either: Either<S, F>): either is Success<S> =>
    either.status === 'SUCCESS';

export const isFailure = <S, F>(either: Either<S, F>): either is Failure<F> =>
    either.status === 'FAILURE';

declare const tag: unique symbol;

declare type Tagged<Token> = {
    readonly [tag]: Token;
};

export type Opaque<Type, Token = unknown> = Type & Tagged<Token>;

export type SchemaError<Uri extends string, Code extends string> = {
    uri: Uri;
    code: Code;
    message: string;
};

export const createError = <Uri extends string, Code extends string>(
    uri: Uri,
    code: Code,
    message: string,
): SchemaError<Uri, Code> => ({ uri, code, message });

type ValidateContext<Uri extends string, I, O extends I> = {
    uri: Uri;
    is: (input: I) => input is O;
};

type SchemaArgs<Uri extends string, I, O extends I, E> = {
    uri: Uri;
    is: (input: I) => boolean;
    validate: (input: I, ctx: ValidateContext<Uri, I, O>) => Either<O, E>;
};

export type Schema<Uri extends string, I, O extends I, E> = {
    uri: Uri;
    I: I;
    O: O;
    E: E;
    is: (input: I) => input is O;
    validate: (input: I) => Either<O, E>;
};

export const schema = <Uri extends string, I, O extends I, E>({
    uri,
    is,
    validate,
}: SchemaArgs<Uri, I, O, E>): Schema<Uri, I, O, E> => {
    const _is = (input: I): input is O => is(input);
    const _validate = (input: I) => validate(input, { is: _is, uri });

    return {
        uri,
        I: null as unknown as I,
        O: null as unknown as O,
        E: null as unknown as E,
        is: _is,
        validate: _validate,
    };
};
