export declare const objectKeys: <T extends Record<string, unknown>>(obj: T) => (keyof T)[];
export declare const isObject: (v: unknown) => v is Record<string, unknown>;
export declare const inputToDisplayString: (value: unknown) => string;
export type Ok<T> = {
    status: 'OK';
    value: T;
};
export type Err<T> = {
    status: 'ERR';
    value: T;
};
export type Either<S, F> = Ok<S> | Err<F>;
export declare const err: <T>(value: T) => Err<T>;
export declare const ok: <T>(value: T) => Ok<T>;
export declare const isErr: <O, E>(either: Either<O, E>) => either is Err<E>;
export declare const isOk: <O, E>(either: Either<O, E>) => either is Ok<O>;
export declare const unwrapEither: <O, E>(either: Either<O, E>) => O;
export declare const matchEither: <O, E, OnOk extends (value: O) => any, OnErr extends (err: E) => any>(either: Either<O, E>, { onOk, onErr }: {
    onOk: OnOk;
    onErr: OnErr;
}) => ReturnType<OnOk> | ReturnType<OnErr>;
export declare const matchObjectProperties: <T extends Record<string, Either<any, any>>, OnOk extends (value: any) => any, OnErr extends (err: any) => any>(eitherObject: T, { onOk, onErr }: {
    onOk: OnOk;
    onErr: OnErr;
}) => {
    eitherObject: T;
    onOk: OnOk;
    onErr: OnErr;
};
declare const tag: unique symbol;
declare type Tagged<Token> = {
    readonly [tag]: Token;
};
export type Opaque<Type, Token = unknown> = Type & Tagged<Token>;
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
export declare const createError: <Code extends string, Details = unknown>({ code, message, details }: CreateErrorArgs<Code, Details>) => (input: unknown, ctx: ErrorCtx) => SchemaError<Code, Details>;
export type Validation<Input, Output extends Input, ErrCode extends string, Err extends SchemaError<ErrCode>> = {
    is: (input: Input) => input is Output;
    err: (input: Input, ctx: ErrorCtx) => Err;
};
export declare const validation: <Input, Output extends Input, ErrCode extends string, Err_1 extends SchemaError<ErrCode, unknown>>(validation: Validation<Input, Output, ErrCode, Err_1>) => Validation<Input, Output, ErrCode, Err_1>;
export declare const extendValidation: <WrappedInput, WrappedOutput extends WrappedInput, WrappedErrCode extends string, WrappedErr extends SchemaError<WrappedErrCode, unknown>>(wrappedValidation: Validation<WrappedInput, WrappedOutput, WrappedErrCode, WrappedErr>) => <NewInput extends WrappedOutput, NewOutput extends NewInput, NewErrCode extends string, NewErr extends SchemaError<NewErrCode, unknown>>(newValidation: Validation<WrappedOutput, NewOutput, NewErrCode, NewErr>) => Validation<WrappedInput, NewOutput, WrappedErrCode | NewErrCode, WrappedErr | NewErr>;
export declare const withValidations: <S extends Schema<string, any, any, any>, Validations extends Validation<any, InferType<S>, string, any>[]>(s: S, validations: Validations) => Schema<S["uri"], InferInputType<S>, InferType<S>, ReturnType<S["err"]> | ReturnType<Validations[number]["err"]>>;
type SchemaArgs<Uri extends string, Input, Output extends Input, ErrCode extends string, Err extends SchemaError<ErrCode>> = {
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
export declare const schema: <Uri extends string, Input, Output extends Input, ErrCode extends string, Err_1 extends SchemaError<ErrCode, unknown>>({ uri, displayString, create, validation, }: SchemaArgs<Uri, Input, Output, ErrCode, Err_1>) => Schema<Uri, Input, Output, Err_1>;
export type InferInputType<S extends Schema<string, any, any, SchemaError<string>>> = Parameters<S['validate']>[0];
export type InferType<S extends Schema<string, any, any, SchemaError<string>>> = ReturnType<S['validate']> extends Either<infer O, unknown> ? O : never;
export type InferErrorType<S extends Schema<string, any, any, SchemaError<string>>> = ReturnType<S['validate']> extends Either<any, infer E> ? E : never;
export {};
