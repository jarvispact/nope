/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
type Success<T> = { status: 'SUCCESS'; value: T };
type Failure<T> = { status: 'FAILURE'; value: T };
type Either<S, F> = Success<S> | Failure<F>;

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

export const err = <
    Uri extends string,
    Code extends string,
    Details extends { [Key: string]: unknown },
>(
    uri: Uri,
    code: Code,
    message: string,
    // @ts-ignore
    details?: Details = {},
) => ({
    uri,
    code,
    message,
    details,
});

export type Schema<Input, Output extends Input, Err, Uri extends string> = {
    I: Input;
    O: Output;
    E: Err;
    uri: Uri;
    is: (input: Input) => input is Output;
    create: (input: Input) => Output;
    validate: (input: Input) => Either<Output, Err[]>;
};

export type SchemaConstructor<
    Input,
    Output extends Input,
    Err,
    Uri extends string,
> = () => Schema<Input, Output, Err, Uri>;

export type CreateSchemaProps<
    Input,
    Output extends Input,
    Err,
    Uri extends string,
> = {
    uri: Uri;
    is: (input: Input) => input is Output;
    create: (input: Input) => Output;
    validate: (
        input: Input,
        ctx: {
            uri: Uri;
            is: (input: Input) => input is Output;
            create: (input: Input) => Output;
        },
    ) => Either<Output, Err[]>;
};

export const createSchema = <
    Input,
    Output extends Input,
    Err,
    Uri extends string,
>({
    uri,
    is,
    create,
    validate,
}: CreateSchemaProps<Input, Output, Err, Uri>): SchemaConstructor<
    Input,
    Output,
    Err,
    Uri
> => {
    const I = null as unknown as Input;
    const O = null as unknown as Output;
    const E = null as unknown as Err;

    return () => ({
        I,
        O,
        E,
        uri,
        is,
        create,
        validate: (input) => validate(input, { uri, is, create }),
    });
};

export const extendSchema = <
    S extends Schema<any, any, any, any>,
    Output extends S['I'],
    Err,
    Uri extends string,
>(
    schema: S,
    { uri, is, create, validate }: CreateSchemaProps<S['I'], Output, Err, Uri>,
) => {
    return createSchema({
        uri,
        is: (input): input is Output => schema.is(input) && is(input),
        create,
        validate: (input, ctx) => {
            const either = schema.validate(input);
            const result = validate(input, ctx);

            const errors = [either, result]
                .filter((e) => e.status === 'FAILURE')
                .flatMap((e) => e.value) as (Err | S['E'])[];

            if (errors.length) return failure(errors);

            return success(input);
        },
    });
};

export const identity = <T>(val: T) => val;

declare const tag: unique symbol;

declare type Tagged<Token> = {
    readonly [tag]: Token;
};

export type Opaque<Type, Token = unknown> = Type & Tagged<Token>;
