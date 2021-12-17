# nope
a validation library for typescript with strongly typed errors and awesome type inference

## what is it?

It is a schema based validation library that has this 3 main goals:

- **You dont have to write a single type!** You can extract the static type from the schema itself.
- **Strongly typed errors!** Every schema defines all possible errors that can happen.
- **Composable and extendable!** Use, create and compose little building blocks to form more complex ones.

---

## How to use it?

The basic idea is that you define a schema and use it to extract the static types for Input (`I`), Output (`O`) and Error (`E`):

```ts
import { record, string, union, literal } from '../../lib/nope';

const TodoSchema = record({
    id: string(),
    content: string(),
    status: union([literal('COMPLETE'), literal('INCOMPLETE')]),
});

type TodoInput = typeof TodoSchema['I'];
// this is the static type for the Input of your validate function
/**
{
    id: string;
    content: string;
    status: 'COMPLETE' | 'INCOMPLETE';
}
*/

type Todo = typeof TodoSchema['O'];
// this is the static type for your domain model: Todo
/**
{
    id: string;
    content: string;
    status: 'COMPLETE' | 'INCOMPLETE';
}
*/

type TodoError = typeof TodoSchema['E'];
// this is the static type of an Error for this schema:
/**
{
    errors: Array<RecordError>;
    properties: {
        id: Either<string, StringError>;
        content: Either<string, StringError>;
        status: Either<'COMPLETE' | 'INCOMPLETE', UnionError>;
    }
}
*/
```

So now you have defined a schema and you have extracted the static types for Input, Output and Error to be used across your codebase. How do we validate data with this schema?

```ts
// The signatue of the validate function
type I = typeof TodoSchema['I']; // Input
type O = typeof TodoSchema['O']; // Output
type E = typeof TodoSchema['E']; // Error
type validate = (input: I) => Either<O, E>;

// lets validate some input data:
const either = TodoSchema.validate({
    id: '42',
    content: 'some content',
    status: 'INCOMPLETE',
});
```

---

## a complex example

```ts
const AddressSchema = record({
    street: string(),
    zip: string(),
    city: string(),
    country: union([literal('AT'), literal('DE'), literal('CH')]),
});

const UserSchema = record({
    name: string(),
    email: string(),
    password: string(),
    birthday: date(),
    newsletter: optional(boolean()),
    importedAt: nullable(date()),
    address: record({
        main: AddressSchema,
        others: array(AddressSchema),
    }),
    profileData: partial(
        record({
            language: union([literal('DE'), literal('IT'), literal('FR')]),
            theme: union([literal('light'), literal('dark')]),
        }),
    ),
});

type User = typeof UserSchema['O'];
/**
{
    name: string;
    email: string;
    password: string;
    birthday: Date;
    newsletter: boolean | undefined;
    importedAt: Date | null;
    address: {
        main: {
            street: string;
            zip: string;
            city: string;
            country: "AT" | "DE" | "CH";
        };
        others: {
            street: string;
            zip: string;
            city: string;
            country: "AT" | "DE" | "CH";
        }[];
    };
    profileData: {
        language?: "DE" | "IT" | "FR";
        theme?: "light" | "dark";
    };
}
*/

type UserError = typeof UserSchema['E'];
/**
{
    errors: Array<RecordError>;
    properties: {
        name: Either<string, StringError>;
        email: Either<string, StringError>;
        password: Either<string, StringError>;
        birthday: Either<Date, DateError>;
        newsletter: Either<boolean | undefined, BooleanError>;
        importedAt: Either<Date | null, DateError>;
        address: {
            errors: Array<RecordError>;
            properties: {
                main: {
                    errors: Array<RecordError>;
                    properties: {
                        street: Either<string, StringError>;
                        zip: Either<string, StringError>;
                        city: Either<string, StringError>;
                        country: Either<"AT" | "DE" | "CH", UnionError>;
                    }
                }
                others: {
                    errors: Array<ArrayErrors>;
                    items: Array<{
                        errors: Array<RecordError>;
                        properties: {
                            street: Either<string, StringError>;
                            zip: Either<string, StringError>;
                            city: Either<string, StringError>;
                            country: Either<"AT" | "DE" | "CH", UnionError>;
                        }
                    }>
                }
            }
        }
        profileData: {
            errors: Array<RecordError>;
            properties: {
                language?: Either<"DE" | "IT" | "FR", UnionError>;
                theme?: Either<"light" | "dark", UnionError>;
            }
        }
    }
}
*/
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

## constraints

Up until now we were able to validate basic types like string, number, array etc. but we are not able to validate a email address for example. Constraints can do that. Every constraint needs to provide a `when` and `error` function. If `when` returns true, your `error` will be used. Also these constraint errors are strongly typed and will be returned from the validate function. Lets see a example:

```ts
const minLengthConstraint = (minLength: number) =>
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

const emailConstraint = () =>
    stringConstraint({
        when: (input) =>
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
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

const LoginSchema = record({
    email: string([emailConstraint()]),
    password: string([minLengthConstraint(8)]),
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