/* eslint-disable @typescript-eslint/no-explicit-any */

// UTILS

export const objectKeys = <T extends Record<string, unknown>>(obj: T) => Object.keys(obj) as Array<keyof T>;

export const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && !Array.isArray(v) && v !== null && !(v instanceof Date);

export type InputToDisplayStringOptions = {
    maxArrayDisplayProperties?: number;
    maxObjectDisplayProperties?: number;
};

const defaultOptions = {
    maxArrayDisplayProperties: 3,
    maxObjectDisplayProperties: 3,
};

export const inputToDisplayString = (value: unknown, options?: InputToDisplayStringOptions): string => {
    const opts = { ...defaultOptions, ...options };
    switch (typeof value) {
        case 'string':
            return `'${value}'`;
        case 'number':
        case 'boolean':
            return value.toString();
        case 'object': {
            if (value === null) return 'null';
            if (value instanceof Date) return 'Date';

            if (Array.isArray(value)) {
                const additionalItemsCount = Math.max(0, value.length - opts.maxArrayDisplayProperties);
                const items = value
                    .slice(0, opts.maxArrayDisplayProperties)
                    .map((item) => inputToDisplayString(item, opts))
                    .join(', ');
                return value.length > 0
                    ? `[ ${items}${additionalItemsCount > 0 ? `, + ${additionalItemsCount} more` : ''} ]`
                    : '[]';
            }

            const keys = Object.keys(value);
            const additionalKeyCount = Math.max(0, keys.length - opts.maxObjectDisplayProperties);

            const pairs = keys
                .slice(0, opts.maxObjectDisplayProperties)
                .map((key) => `${key}: ${inputToDisplayString(value[key as keyof typeof value], opts)}`)
                .join(', ');

            return keys.length > 0
                ? `{ ${pairs}${additionalKeyCount > 0 ? `, + ${additionalKeyCount} more` : ''} }`
                : '{}';
        }
        case 'undefined':
            return 'undefined';
        default:
            return 'unknown';
    }
};

// EITHER

export type Ok<T> = { status: 'OK'; value: T };
export type Err<T> = { status: 'ERR'; value: T };
export type Either<S, F> = Ok<S> | Err<F>;

export const err = <T>(value: T): Err<T> => ({ status: 'ERR', value });
export const ok = <T>(value: T): Ok<T> => ({ status: 'OK', value });

export const isErr = <O, E>(either: Either<O, E>): either is Err<E> => either.status === 'ERR';

export const isOk = <O, E>(either: Either<O, E>): either is Ok<O> => either.status === 'OK';

export const unwrapEither = <O, E>(either: Either<O, E>) => {
    if (isErr(either)) throw new Error('Cannot not unwrap either');
    return either.value;
};

// MATCH

export const matchEither = <O, E, OnOk extends (value: O) => any, OnErr extends (err: E) => any>(
    either: Either<O, E>,
    { onOk, onErr }: { onOk: OnOk; onErr: OnErr },
): ReturnType<OnOk> | ReturnType<OnErr> => (isOk(either) ? onOk(either.value) : onErr(either.value));

export const matchObjectProperties = <
    T extends Record<string, Either<any, any>>,
    OnOk extends (value: any) => any,
    OnErr extends (err: any) => any,
>(
    eitherObject: T,
    { onOk, onErr }: { onOk: OnOk; onErr: OnErr },
) => ({ eitherObject, onOk, onErr });

// OPAGUE

declare const tag: unique symbol;

declare type Tagged<Token> = {
    readonly [tag]: Token;
};

export type Opaque<Type, Token = unknown> = Type & Tagged<Token>;

// SCHEMA ERROR

type CreateErrorArgs<Code extends string, Details = unknown> = {
    code: Code;
    message?: string;
    details?: Details;
};

type ErrorCtx = {
    uri: string;
    displayString: string;
};

export type SchemaError<Code extends string, Details = unknown> = {
    code: Code;
    message: string;
    details: ErrorCtx & Details;
};

export const createError =
    <Code extends string, Details = unknown>({ code, message, details }: CreateErrorArgs<Code, Details>) =>
    (input: unknown, ctx: ErrorCtx): SchemaError<Code, Details> => ({
        code,
        message: message || `input: ${inputToDisplayString(input)}, does not match the type of: '${ctx.displayString}'`,
        details: (details ? { ...ctx, ...details } : ctx) as ErrorCtx & Details,
    });

// VALIDATION

export type Validation<Input, Output extends Input, ErrCode extends string, Err extends SchemaError<ErrCode>> = {
    is: (input: Input) => input is Output;
    err: (input: Input, ctx: ErrorCtx) => Err;
};

export const validation = <Input, Output extends Input, ErrCode extends string, Err extends SchemaError<ErrCode>>(
    validation: Validation<Input, Output, ErrCode, Err>,
) => validation;

export const extendValidation =
    <
        WrappedInput,
        WrappedOutput extends WrappedInput,
        WrappedErrCode extends string,
        WrappedErr extends SchemaError<WrappedErrCode>,
    >(
        wrappedValidation: Validation<WrappedInput, WrappedOutput, WrappedErrCode, WrappedErr>,
    ) =>
    <
        NewInput extends WrappedOutput,
        NewOutput extends NewInput,
        NewErrCode extends string,
        NewErr extends SchemaError<NewErrCode>,
    >(
        newValidation: Validation<WrappedOutput, NewOutput, NewErrCode, NewErr>,
    ) =>
        ({
            is: (input) => wrappedValidation.is(input) && newValidation.is(input),
            err: (input, ctx) => {
                if (!wrappedValidation.is(input)) return wrappedValidation.err(input, ctx);
                return newValidation.err(input, ctx);
            },
        } as Validation<WrappedInput, NewOutput, NewErrCode | WrappedErrCode, NewErr | WrappedErr>);

export const withValidations = <
    S extends Schema<string, any, any, any>,
    Validations extends Validation<any, InferType<S>, string, any>[],
>(
    s: S,
    validations: Validations,
): Schema<S['uri'], InferInputType<S>, InferType<S>, ReturnType<S['err']> | ReturnType<Validations[number]['err']>> =>
    schema({
        uri: s.uri,
        create: s.create,
        validation: validation({
            is: (input): input is InferType<S> => s.is(input) && validations.every((v) => v.is(input)),
            err: (input, ctx) => {
                if (!s.is(input)) return s.err(input, ctx);
                const v = validations.find((v) => !v.is(input));
                return v?.err(input, ctx);
            },
        }),
    });

// SCHEMA

type SchemaArgs<
    Uri extends string,
    Input,
    Output extends Input,
    ErrCode extends string,
    Err extends SchemaError<ErrCode>,
> = {
    uri: Uri;
    displayString?: string;
    create: (input: Input) => Output;
    validation: Validation<Input, Output, ErrCode, Err>;
};

export type Schema<Uri extends string, Input, Output extends Input, Err extends SchemaError<string>> = {
    uri: Uri;
    displayString: string;
    is: (input: Input) => input is Output;
    create: (input: Input) => Output;
    err: (input: Input, ctx: ErrorCtx) => Err;
    validate: (input: Input) => Either<Output, Err>;
};

export const schema = <
    Uri extends string,
    Input,
    Output extends Input,
    ErrCode extends string,
    Err extends SchemaError<ErrCode>,
>({
    uri,
    displayString = uri,
    create,
    validation,
}: SchemaArgs<Uri, Input, Output, ErrCode, Err>): Schema<Uri, Input, Output, Err> => {
    const validate = (input: Input) =>
        validation.is(input) ? ok(create(input)) : err(validation.err(input, { uri, displayString }));
    return {
        uri,
        displayString,
        is: validation.is,
        create,
        err: validation.err,
        validate,
    };
};

export type InferInputType<S extends Schema<string, any, any, SchemaError<string>>> = Parameters<S['validate']>[0];

export type InferType<S extends Schema<string, any, any, SchemaError<string>>> = ReturnType<
    S['validate']
> extends Either<infer O, unknown>
    ? O
    : never;

export type InferErrorType<S extends Schema<string, any, any, SchemaError<string>>> = ReturnType<
    S['validate']
> extends Either<any, infer E>
    ? E
    : never;
