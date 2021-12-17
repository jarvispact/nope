Hi 👋. I got a little schwifty on a side project recently: a schema based validation library. If you dont know what "schwifty" means:

*Schwifty is a made-up term from the animated show Rick and Morty in 2015. It means completely letting loose while partying.*

## Another validation library, are you serious?

This was a experiment to take a deep dive on some more advanced topics of typescript and this experiment is still ongoing. There are still some topics i want to explore and it is nothing you can use today. I want to share the basic idea behind it and explain the implementation to you. But if you are curious or want to give me some feedback, here it is: [nope](https://github.com/jarvispact/nope).

---

## Tell me more ...

After several iterations, i came up with a schema based validation library that offers this 3 main goals to its users:

- **You dont have to write a single type!** You can extract the static type from the schema itself.
- **Strongly typed errors!** Every schema defines all possible errors that can happen.
- **Composable and extendable!** Use, create and compose little building blocks to form more complex ones.

---

## What is the use case for this anyway?

It can be used on the backend and on the frontend for the following concerns:

- **domain models** The core of any application is the domain. Doesnt matter if you are working on a backend or frontend project, you want to have some sort of domain model and a validation to ensure that it is correct.
- **user input** Your domain models will interact with some sort of user input. On the frontend this happens through forms and inputs, on the backend through request payloads.
- **edge validation** On the backend your application maybe has to talk to some upstream service, on the frontend you need to load data from 1 or more servers.

---

In order to follow this blog post, you should have worked with typescript in the past and have a decent understanding of generics, type inference, union types and the keywords: `typeof` `keyof` and `as const`. I will not cover it, there are plenty of tutorials on the web already.

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

This would be successful, since the data matches our schema definition. If the data would look different it may fail. Thats why i named the result `either`. The `validate` function does not throw, it returns a `Either<Success, Failure>` type. Ok. Now we have seen how we would declare a schema and use it to validate data. In the next section we will have a look on the basic idea and how the `string()` schema constructor is implemented.

---

## The basic idea

We will just define some types and helpers upfront, so we can use them later when we define the actual schema constructor:

```ts
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

const isSuccess = <S, F>(either: Either<S, F>): either is Success<S> =>
    either.status === 'SUCCESS';

const isFailure = <S, F>(either: Either<S, F>): either is Failure<F> =>
    either.status === 'FAILURE';
```

The `Success`, `Failure` and `Either` types and the `success` and `failure` helpers should be pretty self explanatory. But have you noticed this syntax?

```ts
(either: Either<S, F>): either is Success<S>
```

This is a custom type guard. A custom type guard is a simple function which should return true if the passed argument is of the type that you have specified with the `is` syntax. Whaaat? For example, if you call `isSuccess` with an `Either<Success, Failure>` type, and it returns true, typescript will know that it is of type `Success` and in the else block, it will know that it is of type `Failure`.

```ts
const either = TodoSchema.validate({
    id: '42',
    content: 'some content',
    status: 'INCOMPLETE',
});

// typeof either = Either<Todo, TodoError>

if (isSuccess(either)) {
    const { value } = either; // value is of type: Todo
} else {
    const { value } = either; // value is of type: TodoError
}
```

Awesome! Now lets define a very simple `string()` schema constructor. Just like the one we have used already for `id` and `content` of a `Todo`:

```ts
const stringError = (input: unknown) => ({
    schema: 'string' as const,
    code: 'E_NOT_A_STRING' as const,
    message: '',
    details: {
        provided: {
            type: typeof input,
            value: input,
        },
        expected: {
            type: 'string',
        },
    },
});

type StringError = ReturnType<typeof stringError>;

export const string = () => {
    const I = null as unknown as string; // type for Input
    const O = null as unknown as string; // type for Output
    const E = null as unknown as StringError; // type for Error

    const validate = (input: typeof I): Either<typeof O, typeof E> =>
        typeof input === 'string'
            ? success(input)
            : failure(stringError(input));

    return {
        schema: 'string' as const,
        I,
        O,
        E,
        validate,
    };
};
```

The `stringError` function returns a error object. its completely up to you how the shape of the error object looks. The most important property is: `code`. This should be a unique error code across all of the possible errors, across all of the schemas. Thats why we have labelled it with `as const`. This ensures that it is not of type `string` but of type `E_NOT_A_STRING`. So no other string is assignable to this. It will become handy later to also return a `schema` property set to the type: `string` via the `as const` keyword.

The `string` function returns a object with some properties. Let me explain why we need them. We know already that we will need a validate function that returns a `Either<Success, Failure>` type. So in this specific case of a string schema: `Either<string, StringError>`. But we will also need 3 types, namely: `I`, `O` and `E`. Those properties are set to `null` for all of the schemas, but we manually set it to the Input, Output and Error types of the current schema via the `as unknown as SomeType` syntax. This basically tells typescript to shut up because you know what you are doing. This makes it easy to extract the types for `Success` and `Failure` later on:

```ts
const schema = string();

type Input = typeof schema['I']; // string
type Output = typeof schema['O']; // string
type Error = typeof schema['E']; // StringError
```

The types `I` and `O` are the same for all of the primitive schemas like: string, number, boolean, date, record, array, ... but they can be different for domain types in your application. Imagine a `Email` or a `Uuid` type. Both are of the primitive type: `string`. But they have some additional validation in order to be a valid email address or uuid. Unfortunately we cannot simply alias it like this: `type Email = string` and ensure the validation in the validate function, because typescript has no support for opaque types and will always fall back to string in compiler error messages. I am currently looking into a solution for this and i will maybe write another blog post about this topic 😊.

The awesome thing about this is that, once you have written some schema constructors for the basic types in javascript, you can combine them in many ways and form really complex schemas.

---

## Example

Here is a example of a schema that you could build with some primitive schema constructors. Also this is possible today with [nope](https://github.com/jarvispact/nope)

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

See how awesome this is? You dont need to define a single type upfront. Just define your schema that you can use to validate your data and extract the types from it. Every possible error on any level, has a unique `code` and is strongly typed. That means you can react to every possible error in a different way at runtime and have a lot of information about every error available.

---

We are still missing a important part. Up until now we can only validate if some data is of some javascript type, like `string`, `number`, `object` or `array` for example. Thats enough to extract the static type and ensure the correct type at runtime, but a validation library should be able to validate if:

- some input string has a required minimum length
- some input number is between a valid range
- some input array has a required minimum length
- ...

Let me introduce you to constraints.

---

## Constraints

for some primitive schema constructors, it doesnt make sense to have constraints, for others it makes sense. So lets take the `string` schema constructor as an example once again. This is how the `stringConstraint` function looks:

```ts
const stringConstraint = <I extends string, C extends string, T>({
    when,
    error,
}: {
    when: (input: I) => boolean;
    error: (input: I) => { code: C; message: string; details?: T };
}) => ({
    when,
    error: (input: I) => {
        const { code, message, details } = error(input);
        return {
            schema: 'string' as const,
            code,
            message,
            details: {
                provided: {
                    type: typeof input,
                    value: input,
                },
                constraint: details,
            },
        };
    },
});

type Constraint = ReturnType<typeof stringConstraint>;
```

You can specify a check via the `when` function and a error constructor that will be called if your `when` function returns true. Now we can use this function to create all sorts of string constraints, like:

- check if the input string has some minimum length
- check if the input string does not exceed some maximum length
- check if the input string starts with some string
- check if the input string is a valid email address
- ...

Lets see 2 examples of such constraints:

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
```

Again you have to provide at least a `code` and a `message`, a `details` object is optional and you are free to put there whatever you want. Now we have some constraints, but what will we do with them? Well, we need to adapt our `string` schema constructor function a bit to be able to pass this constraints, so we can call it within the validate function of our schema.

```ts
export const string = <C extends Constraint>(constraints: Array<C>) => {
    const I = null as unknown as string;
    const O = null as unknown as string;
    const E = null as unknown as Array<StringError | ReturnType<C['error']>>;

    const validate = (input: typeof I): Either<typeof O, typeof E> => {
        if (typeof input !== 'string') return failure([stringError(input)]);

        // this is the new part. mostly
        const errors = ((constraints || []) as Array<C>)
            .map((c) => (c.when(input) ? c.error(input) : undefined))
            .filter(Boolean) as Array<ReturnType<C['error']>>;

        return errors.length ? failure(errors) : success(input);
    };

    return {
        schema: 'string' as const,
        I,
        O,
        E,
        validate,
    };
};

const schema = string([emailConstraint(), minLengthConstraint(8)]);
type ErrorCode = typeof schema['E'][number]['code'];
// "E_MIN_STRING_LENGTH" | "E_NOT_A_EMAIL_ADDRESS" | "E_NOT_A_STRING"
```

If you validate some input string with this schema and it fails, typescript knows exactly what errors can happen during the validation and it can support you during error handling. If you change your schema or your constraint functions, and some code depends on it, your application wont compile anymore.

---

## Closing

❤ Typescript is awesome ❤. I really love how you can infer the types from your functions and objects. Also i love that all of those little schema constructors are composable with each other to form really complex schemas. Im curious to further play around with it, add more features and try it in different scenarios. I hope that you learned something new or at least got inspired to get schwifty with generics and type inference yourself.

Let me know what you think and leave some feedback. Okay 👋
