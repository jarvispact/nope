# @beerstack/nope
a validation library for typescript with strongly typed errors and awesome type inference

## what is it?

it is a schema based validation library. You can use it for edge validation, user input validation and domain validation. What makes this library special are 2 things:

- **You dont have to write a single type!** You can extract the type from the schema itself.
- **Strongly typed errors!** Every schema defines all possible errors that can happen.

That means that you dont have to keep your types in sync with your code. If you change your code (your schema definition) all of the types are up to date and your app wont compile anymore if the code that relies on your schema definition is not compatible anymore. So, you can extract the static type from the schema and use the schema to perform runtime validation on your data. Also if your validation returns an error, those error objects are strongly typed.


## the basic idea

a schema constructor is a function that returns a object with some properties. the most relevant property for you to know is that it returns a validate function. this validate function will return a type looking like this: `Either<Success, Failure>`. here is the full definition of the `Either` type:

```ts
export type Success<T> = { status: 'SUCCESS'; value: T };
export type Failure<T> = { status: 'FAILURE'; value: T };
export type Either<S, F> = Success<S> | Failure<F>;
```

lets have a look on a basic example: the string schema constructor:

```ts
// declare the schema
const schema = string(); // returns a schema of type: Schema<string, string, Array<StringError>>

// extract the static types for Success and Failure:
type O = typeof schema['O']; // string
type E = typeof schema['E']; // Array<StringError>

// ok
const either = schema.validate('42');

// Error: Argument of type 'number' is not assignable to parameter of type 'string'
const either = schema.validate(42);
```

in both cases the validate function returns a `Either<Success, Failure>`. You can use a if statement to react on success and failure:

```ts
const either = schema.validate('42');
if (isSuccess(either)) {
    // in this branch, either is of type `Success` and looks like this:
    // { status: 'SUCCESS', value: '42' }
    const value = either.value; // string
} else {
    // in this branch, either is of type `Failure` and looks like this:
    /**
    {
        status: 'FAILURE',
        value: [
            {
                schema: 'string',
                code: 'E_NOT_A_STRING',
                message: 'provided value is not of type: "string"',
                details: {
                    provided: {
                        type: 'number',
                        value: 42,
                    },
                    expected: {
                        type: 'string',
                    },
                },
            },
        ],
    }
    */
}
```

## whats in this libray?

the following schema constructors are provided and you can compose them in many different ways:

- string
- number
- boolean
- date
- literal
- optional
- nullable
- array
- record
- partial
- union

## hello world

```ts
const LoginSchema = record({
    email: string(),
    password: string(),
});

// invalid call to validate. password missing
LoginSchema.validate({ email: 'bruce.wayne@wayne-enterprises.com' })

// invalid call to validate. email missing
LoginSchema.validate({ password: 'ironmansucks' })

// invalid call to validate. email must be a string
LoginSchema.validate({ email: 42, password: 'ironmansucks' })

// ok
const either = LoginSchema.validate({
    email: 'bruce.wayne@wayne-enterprises.com',
    password: 'ironmansucks',
})

if (isSuccess(either)) {
    // Yay. Your data is valid!
    const { email, password } = either.value;
} else {
    // Nope. You data is not valid!
    const { errors, properties } = either.value;
    const { email, password } = properties;
}
```

## constraints

Up until now we were able to validate basic types like string, number, array etc. but we are not able to validate a email address for example. Constraints can do that. Every constraint needs to provide a `when` and `error` function. If `when` returns true, your `error` will be used. Also these constraint errors are strongly typed and will be returned from the validate function. Lets see a example:

```ts
const emailConstraint = () =>
    stringConstraint({
        when: (input) => !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
        error: () => ({
            code: 'E_NOT_A_EMAIL_ADDRESS',
            message: 'it is not a valid email address',
            details: {
                expected: {
                    type: 'string',
                },
            },
        }),
    });

const minStringLengthConstraint = (minLength: number) =>
    stringConstraint({
        when: (input) => input.length < minLength,
        error: () => ({
            code: 'E_MIN_STRING_LENGTH',
            message: 'input does not have the required minimum length',
            details: {
                expected: {
                    type: 'string',
                    minLength,
                },
            },
        }),
    });

const LoginSchema = record({
    email: string([emailConstraint()]),
    password: string([minStringLengthConstraint(8)]),
});

// extract the static types for Success and Failure:

type O = typeof schema['O'];
// { email: string; password: string; }

type E = typeof schema['E'];
/**
{
    errors: Array<RecordError>,
    properties: {
        email: Either<string, Array<StringError | ConstraintError>>,
        password: Either<string, Array<StringError | ConstraintError>>,
    }
}
*/

// ========================================
// looking even closer at the static types:

type E1 = typeof schema['E']['errors'][number]['code']; // E_NOT_A_RECORD | E_MISSING_RECORD_KEYS | E_UNKNOWN_RECORD_KEYS

type E2 = typeof schema['E']['properties']['email']['code']; // E_NOT_A_STRING | E_NOT_A_EMAIL_ADDRESS
type E3 = typeof schema['E']['properties']['password']['code']; // E_NOT_A_STRING | E_MIN_STRING_LENGTH
```

## more examples

Lets have a look on some other examples:

```ts
const schema = partial(record({
    foo: string(),
    bar: string(),
}));

type O = typeof schema['O']; // { foo?: string;, bar?: string; }

const either = schema.validate({}) // ok
const either = schema.validate({ foo: 42 }) // nope
```

```ts
const schema = array(record({
    foo: string(),
    bar: string(),
}));

type O = typeof schema['O']; // Array<{ foo: string;, bar: string; }>

const either = schema.validate([]) // ok
const either = schema.validate({}) // nope
const either = schema.validate([{ foo: '42' }]) // nope
```

```ts
const schema = union([
    literal('AT'),
    literal('DE'),
    literal('CH'),
]);

type O = typeof schema['O']; // 'AT' | 'DE' | 'CH'

const either = schema.validate('AT') // ok
const either = schema.validate('DE') // ok
const either = schema.validate('CH') // ok
const either = schema.validate(42) // nope
const either = schema.validate('US') // nope
```

```ts
const schema = optional(string());

type O = typeof schema['O']; // string | undefined

const either = schema.validate('') // ok
const either = schema.validate(undefined) // ok
const either = schema.validate(null) // nope
const either = schema.validate(42) // nope
```

```ts
const schema = nullable(string());

type O = typeof schema['O']; // string | null

const either = schema.validate('') // ok
const either = schema.validate(null) // ok
const either = schema.validate(undefined) // nope
const either = schema.validate(42) // nope
```