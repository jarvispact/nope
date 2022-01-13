/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

// ================================ utils

type Success<T> = { status: 'SUCCESS'; value: T };
type Failure<T> = { status: 'FAILURE'; value: T };
type Either<S, F> = Success<S> | Failure<F>;

const success = <T>(v: T): Success<T> => {
    return {
        status: 'SUCCESS',
        value: v,
    };
};

const failure = <T>(v: T): Failure<T> => {
    return {
        status: 'FAILURE',
        value: v,
    };
};

const err = <
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

type Schema<Input, Output extends Input, Err, Uri extends string> = {
    I: Input;
    O: Output;
    E: Err;
    uri: Uri;
    is: (input: Input) => input is Output;
    create: (input: Input) => Output;
    validate: (input: Input) => Either<Output, Err[]>;
};

type SchemaConstructor<
    Input,
    Output extends Input,
    Err,
    Uri extends string,
> = () => Schema<Input, Output, Err, Uri>;

type CreateSchemaProps<Input, Output extends Input, Err, Uri extends string> = {
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

const createSchema = <Input, Output extends Input, Err, Uri extends string>({
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

const extendSchema = <
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

const identity = <T>(val: T) => val;

declare const tag: unique symbol;

declare type Tagged<Token> = {
    readonly [tag]: Token;
};

type Opaque<Type, Token = unknown> = Type & Tagged<Token>;

// ================================= string

const errNoString = (input: unknown) =>
    err('string', 'E_NO_STRING', 'input is not of type: "string"', {
        expectedType: 'string',
        providedValue: input,
    });

type ErrNoString = ReturnType<typeof errNoString>;

const string = createSchema<string, string, ErrNoString, 'string'>({
    uri: 'string',
    is: (input): input is string => typeof input === 'string',
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input)) return success(create(input));
        return failure([errNoString(input)]);
    },
});

type StringSchema = ReturnType<typeof string>;

// ================================= email

type Email = Opaque<string, 'email'>;

const errNoEmail = (input: unknown) =>
    err('email', 'E_NO_EMAIL', 'input is not of type: "email"', {
        expectedType: 'email',
        providedValue: input,
    });

type ErrNoEmail = ReturnType<typeof errNoEmail>;

export const email = extendSchema<StringSchema, Email, ErrNoEmail, 'email'>(
    string(),
    {
        uri: 'email',
        is: (input): input is Email =>
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
        create: (input: string) => input as Email,
        validate: (input, { is, create }) => {
            if (is(input)) return success(create(input));
            return failure([errNoEmail(input)]);
        },
    },
);
