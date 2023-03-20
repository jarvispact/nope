/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */

// ====================================
// UTILITIES

type Ok<T> = { status: 'OK'; value: T };
type Err<T> = { status: 'ERR'; value: T };
type Either<S, F> = Ok<S> | Err<F>;
const err = <T>(value: T): Err<T> => ({ status: 'ERR', value });
const ok = <T>(value: T): Ok<T> => ({ status: 'OK', value });
const isErr = <O, E>(either: Either<O, E>): either is Err<E> => either.status === 'ERR';
const isOk = <O, E>(either: Either<O, E>): either is Ok<O> => either.status === 'OK';
type SchemaError<Code extends string = string> = { code: Code };
const createError = <Code extends string>(code: Code): SchemaError<Code> => ({ code });

// ====================================
// SIMPLE EMAIL VALIDATION

{
    // our custom string type guard
    const isString = (input: unknown): input is string => typeof input === 'string';
    // our custom string type guard that also ensures a valid email address at runtime
    const isEmail = (input: string): input is string => input.includes('@');

    // declare the possible errors
    const stringErr = createError('E_STRING');
    const emailErr = createError('E_EMAIL');

    // infer the possible error types
    type PossibleError = typeof stringErr | typeof emailErr;

    // our validate function
    // we wrap our return values for success and error case in the `ok()` and `err()` util functions
    const validate = (input: unknown): Either<string, PossibleError> => {
        if (!isString(input)) return err(stringErr);
        if (!isEmail(input)) return err(emailErr);
        return ok(input);
    };

    const someValueFromAFormOrApi: unknown = 'not a email';

    // validate the input and check the result types
    const either = validate(someValueFromAFormOrApi);
    if (isOk(either)) {
        // typeof `email`: string
        // at runtime it is guaranteed that it is a valid email address
        const email = either.value;
    } else {
        const errCode = either.value.code; // typeof `errCode`: "E_STRING" | "E_EMAIL"
    }
}

// ====================================
// VALIDATION

type Validation<Input, Output extends Input, Err extends SchemaError> = {
    is: (input: Input) => input is Output;
    err: (input: Input) => Err;
};

// we just return the argument, without doing anything to it
// this allows us to leverage typescript type inference
// and reduce the number of types our library user has to write
const validation = <Input, Output extends Input, Err extends SchemaError>(validation: Validation<Input, Output, Err>) =>
    validation;

// ====================================
// STRING AND EMAIL VALIDATION

// JUST HERE TO ACCESS IT IN OTHER EXAMPLES
const StringValidation = validation({
    is: (input): input is string => typeof input === 'string',
    err: () => createError('E_STRING'),
});

{
    const StringValidation = validation({
        is: (input): input is string => typeof input === 'string',
        err: () => createError('E_STRING'),
    });
}
{
    const EmailValidation = validation({
        is: (input): input is string => StringValidation.is(input) && input.includes('@'),
        err: (input) => {
            if (!StringValidation.is(input)) return StringValidation.err(input);
            return createError('E_EMAIL');
        },
    });
}

// ====================================
// EXTEND VALIDATION

// FOR THE SIMPLIFIED VALIDATION AND SCHEMA TYPES
export const extendValidation =
    <WrappedInput, WrappedOutput extends WrappedInput, WrappedErr extends SchemaError>(
        wrappedValidation: Validation<WrappedInput, WrappedOutput, WrappedErr>,
    ) =>
    <NewInput extends WrappedOutput, NewOutput extends NewInput, NewErr extends SchemaError>(
        newValidation: Validation<WrappedOutput, NewOutput, NewErr>,
    ) =>
        ({
            is: (input) => wrappedValidation.is(input) && newValidation.is(input),
            err: (input) => {
                if (!wrappedValidation.is(input)) return wrappedValidation.err(input);
                return newValidation.err(input);
            },
        } as Validation<WrappedInput, NewOutput, NewErr | WrappedErr>);

{
    const EmailValidation = extendValidation(StringValidation)({
        is: (input): input is string => input.includes('@'),
        err: () => createError('E_EMAIL'),
    });
}

// ====================================
// SCHEMA

type SchemaArgs<Input, Output extends Input, Err extends SchemaError> = {
    create: (input: Input) => Output;
    validation: Validation<Input, Output, Err>;
};

type Schema<Input, Output extends Input, Err extends SchemaError> = {
    create: (input: Input) => Output;
    validate: (input: Input) => Either<Output, Err>;
};

// the `create` function is needed to convert a `Input` to a `Output` type. This will be very handy later on
// the `validate` function just wraps validations as we know them already inside of the `Either<Ok, Err>` type

const schema = <Input, Output extends Input, Err extends SchemaError>({
    create,
    validation,
}: SchemaArgs<Input, Output, Err>): Schema<Input, Output, Err> => ({
    create,
    validate: (input: Input) => (validation.is(input) ? ok(create(input)) : err(validation.err(input))),
});

// ====================================
// STRING SCHEMA

{
    // definition

    const StringValidation = validation({
        is: (input): input is string => typeof input === 'string',
        err: () => createError('E_STRING'),
    });

    const StringSchema = schema({
        create: (input) => String(input),
        validation: StringValidation,
    });

    // usage

    const either = StringSchema.validate(42);
    if (isOk(either)) {
        const aString = either.value; // typeof `aString`: string
    } else {
        const errCode = either.value.code; // typeof `errCode`: "E_STRING"
    }
}

// ====================================
// EMAIL SCHEMA

{
    // definition

    const EmailValidation = extendValidation(StringValidation)({
        is: (input): input is string => input.includes('@'),
        err: () => createError('E_EMAIL'),
    });

    const EmailSchema = schema({
        create: (input) => String(input),
        validation: EmailValidation,
    });

    // usage

    const either = EmailSchema.validate(42);
    if (isOk(either)) {
        const aString = either.value; // typeof `aString`: string
    } else {
        const errCode = either.value.code; // typeof `errCode`: "E_STRING" | "E_EMAIL"
    }
}

// ====================================
// OPAQUE TYPES

declare const tag: unique symbol;

type Tagged<Token> = {
    readonly [tag]: Token;
};

type Opaque<Type, Token = unknown> = Type & Tagged<Token>;

type Email = Opaque<string, 'Email'>;
type UnsignedInteger = Opaque<number, 'UnsignedInteger'>;

{
    const email = 'tony@starkindustries.com' as Email;
    const lowercaseEmail = email.toLowerCase(); // ok

    const sendEmail = (address: string) => {};
    sendEmail(email); // ok
    sendEmail(''); // ok
}

{
    const lengthOfSomeList = 1 as UnsignedInteger;
    const timesTen = lengthOfSomeList * 10; // ok

    const getElementFromList = (list: number[], index: number) => {};
    getElementFromList([], lengthOfSomeList); // ok
    getElementFromList([], -1); // ok
}
{
    const email = 'tony@starkindustries.com' as Email;

    const sendEmail = (address: Email) => {};
    sendEmail(email); // ok
    // @ts-expect-error
    sendEmail(''); // Argument of type 'string' is not assignable to parameter of type 'Email'
}
{
    const lengthOfSomeList = 1 as UnsignedInteger;

    const getElementFromList = (list: number[], index: UnsignedInteger) => {};
    getElementFromList([], lengthOfSomeList); // ok
    // @ts-expect-error
    getElementFromList([], -1); // Argument of type 'number' is not assignable to parameter of type 'UnsignedInteger'
}
{
    // definition

    type Email = Opaque<string, 'Email'>;

    const EmailValidation = extendValidation(StringValidation)({
        is: (input): input is Email => input.includes('@'),
        err: () => createError('E_EMAIL'),
    });

    const EmailSchema = schema({
        create: (input: string) => input as Email,
        validation: EmailValidation,
    });

    // usage

    const either = EmailSchema.validate('tony@starkindustries.com');
    if (isOk(either)) {
        const aEmail = either.value; // typeof `aEmail`: Email
    } else {
        const errCode = either.value.code; // typeof `errCode`: "E_STRING" | "E_EMAIL"
    }
}
