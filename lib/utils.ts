/* eslint-disable @typescript-eslint/no-explicit-any */

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

export const createError = <
    Uri extends string,
    Code extends string,
    Details extends { [Key: string]: unknown },
>(
    uri: Uri,
    code: Code,
    message: string,
    details: Details = {} as Details,
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
    validate: (input: Input) => Either<Output, Err>;
};

type CreateSchemaPropsWithValidateFunction<
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
    ) => Either<Output, Err>;
};

type CreateSchemaPropsWithErrorConstructor<
    Input,
    Output extends Input,
    Err,
    Uri extends string,
> = {
    uri: Uri;
    is: (input: Input) => input is Output;
    create: (input: Input) => Output;
    err: (input: Input) => Err;
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
}: CreateSchemaPropsWithValidateFunction<Input, Output, Err, Uri>): Schema<
    Input,
    Output,
    Err,
    Uri
> => {
    const I = null as unknown as Input;
    const O = null as unknown as Output;
    const E = null as unknown as Err;

    return {
        I,
        O,
        E,
        uri,
        is,
        create,
        validate: (input) => validate(input, { uri, is, create }),
    };
};

type ArrayElement<ArrayType> = ArrayType extends readonly (infer ElementType)[]
    ? ElementType
    : ArrayType;

type ExtendSchemaOverload = {
    <
        S extends Schema<any, any, any, any>,
        Input extends S['I'],
        Output extends Input,
        Err,
        Uri extends string,
    >(
        schema: S,
        {
            uri,
            is,
            create,
            validate,
        }: CreateSchemaPropsWithValidateFunction<Input, Output, Err, Uri>,
    ): Schema<Input, Output, Array<Err | ArrayElement<S['E']>>, Uri>;
    <
        S extends Schema<any, any, any, any>,
        Input extends S['I'],
        Output extends Input,
        Err,
        Uri extends string,
    >(
        schema: S,
        {
            uri,
            is,
            create,
            err,
        }: CreateSchemaPropsWithErrorConstructor<Input, Output, Err, Uri>,
    ): Schema<Input, Output, Array<Err | ArrayElement<S['E']>>, Uri>;
};

export const extendSchema: ExtendSchemaOverload = <
    S extends Schema<any, any, any, any>,
    Input extends S['I'],
    Output extends Input,
    Err,
    Uri extends string,
>(
    schema: S,
    {
        uri,
        is,
        create,
        err,
        validate,
    }: {
        uri: Uri;
        is: (input: Input) => input is Output;
        create: (input: Input) => Output;
        err?: (input: Input) => Array<Err | ArrayElement<S['E']>>;
        validate?: (
            input: Input,
            ctx: {
                uri: Uri;
                is: (input: Input) => input is Output;
                create: (input: Input) => Output;
            },
        ) => Either<Output, Array<Err | ArrayElement<S['E']>>>;
    },
) => {
    if (err) {
        return extendSchemaWithErrorConstructor(schema, {
            uri,
            is,
            create,
            err,
        });
    } else if (validate) {
        return extendSchemaWithValidateFunction(schema, {
            uri,
            is,
            create,
            validate,
        });
    }
    throw new Error('err');
};

const extendSchemaWithValidateFunction = <
    S extends Schema<any, any, any, any>,
    Input extends S['I'],
    Output extends Input,
    Err,
    Uri extends string,
>(
    schema: S,
    {
        uri,
        is,
        create,
        validate,
    }: CreateSchemaPropsWithValidateFunction<Input, Output, Err, Uri>,
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
                .flatMap((e) => e.value) as Array<Err | ArrayElement<S['E']>>;

            if (errors.length) return failure(errors);

            return success(input);
        },
    });
};

const extendSchemaWithErrorConstructor = <
    S extends Schema<any, any, any, any>,
    Input extends S['I'],
    Output extends Input,
    Err,
    Uri extends string,
>(
    schema: S,
    {
        uri,
        is,
        create,
        err,
    }: CreateSchemaPropsWithErrorConstructor<Input, Output, Err, Uri>,
) => {
    return createSchema({
        uri,
        is: (input): input is Output => schema.is(input) && is(input),
        create,
        validate: (input) => {
            const either = schema.validate(input);

            const result = is(input)
                ? success(create(input))
                : failure(err(input));

            const errors = [either, result]
                .filter((e) => e.status === 'FAILURE')
                .flatMap((e) => e.value) as Array<Err | ArrayElement<S['E']>>;

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

export const objectKeys = <T extends { [x: string]: unknown }>(rec: T) =>
    Object.keys(rec) as Array<keyof T>;

export const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && !Array.isArray(v) && v !== null;

const getDisplayType = (value: unknown) => {
    if (value === null) return 'null';
    if (value instanceof Date) return 'date';
    if (isObject(value)) return 'record';
    if (Array.isArray(value)) return 'array';
    return typeof value;
};

export const getErrorDetails = <T extends string>(
    expectedType: T,
    input: unknown,
) => ({
    expectedType,
    providedType: getDisplayType(input),
    providedNativeType: typeof input,
    providedValue: input,
});
