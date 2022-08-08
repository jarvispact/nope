/* eslint-disable @typescript-eslint/no-explicit-any */

export const objectKeys = <T extends { [x: string]: unknown }>(rec: T) =>
    Object.keys(rec) as Array<keyof T>;

export const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' &&
    !Array.isArray(v) &&
    v !== null &&
    !(v instanceof Date);

export type AutoComplete<T extends U, U = string> =
    | T
    | (U & { _TS_AUTOCOMPLETE_?: never });

export type Infer<T extends Schema<any, any, any, any>> = T['O'];

export type Valid<T> = { status: 'VALID'; value: T };
export type Invalid<T> = { status: 'INVALID'; value: T };
export type Either<S, F> = Valid<S> | Invalid<F>;

export const valid = <T>(v: T): Valid<T> => {
    return {
        status: 'VALID',
        value: v,
    };
};

export const invalid = <T>(v: T): Invalid<T> => {
    return {
        status: 'INVALID',
        value: v,
    };
};

export const valueOf = <S, F>(either: Either<S, F>) => either.value;

export const isValid = <S, F>(either: Either<S, F>): either is Valid<S> =>
    either.status === 'VALID';

export const isInvalid = <S, F>(either: Either<S, F>): either is Invalid<F> =>
    either.status === 'INVALID';

declare const tag: unique symbol;

declare type Tagged<Token> = {
    readonly [tag]: Token;
};

export type Opaque<Type, Token = unknown> = Type & Tagged<Token>;

export type SchemaError<Uri extends string, Code extends string, Input> = {
    uri: Uri;
    code: Code;
    message: string;
    input: Input;
};

export const createError = <Uri extends string, Code extends string, Input>(
    uri: Uri,
    code: Code,
    message: string,
    input: Input,
): SchemaError<Uri, Code, Input> => ({ uri, code, message, input });

type ErrContext<Uri extends string> = {
    uri: Uri;
    displayString: string;
};

type ValidateContext<Uri extends string, I, O extends I, E> = {
    uri: Uri;
    displayString: string;
    is: (input: I) => input is O;
    err: (input: I) => E;
};

type SchemaArgs<Uri extends string, I, O extends I, E> = {
    uri: Uri;
    displayString?: string;
    is: (input: I) => boolean;
    err: (input: I, ctx: ErrContext<Uri>) => E;
    validate?: (input: I, ctx: ValidateContext<Uri, I, O, E>) => Either<O, E>;
};

export type Schema<Uri extends string, I, O extends I, E> = {
    uri: Uri;
    displayString: string;
    I: I;
    O: O;
    E: E;
    is: (input: I) => input is O;
    err: (input: I) => E;
    validate: (input: I) => Either<O, E>;
};

export const schema = <Uri extends string, I, O extends I, E>({
    uri,
    displayString = uri,
    is,
    err,
    validate,
}: SchemaArgs<Uri, I, O, E>): Schema<Uri, I, O, E> => {
    const _is = (input: I): input is O => is(input);

    const _err = (input: I) => err(input, { uri, displayString });

    const defaultValidate = (input: I) =>
        _is(input) ? valid(input) : invalid(_err(input));

    const _validate = (input: I) =>
        validate
            ? validate(input, { uri, displayString, is: _is, err: _err })
            : defaultValidate(input);

    return {
        uri,
        displayString,
        I: null as unknown as I,
        O: null as unknown as O,
        E: null as unknown as E,
        is: _is,
        err: _err,
        validate: _validate,
    };
};
