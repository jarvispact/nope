Hi 👋. If you dont know what "schwifty" means:

*Schwifty is a made-up term from the animated show Rick and Morty in 2015. It means completely letting loose while partying.*

I stumbled upon this library called [io.ts](https://github.com/gcanti/io-ts) and really liked the concept, but i was pretty new to typescript when i found it. I played around a bit and decided to write a schema validation library that allows me to extract the static type out of the schema. This was out of pure curiosity and more like a use case to get to learn some more advanced typescript features. This is the way how i learn new concepts that i dont fully understand. I re-implement some library from scratch to see how it works.

After a while i came up with a library that has this 2 main benefits:

- **You dont have to write a single type!** You can extract the type from the schema itself.
- **Strongly typed errors!** Every schema defines all possible errors that can happen.

In this blog post i would like to explain the concept and implementation of my library. Its not about the library itself which is still a experiment. But if you are curious, here it is: [@beerstack/nope](https://github.com/jarvispact/nope)

---

## What is the use case for this anyway?

- edge validation (api responses)
- user input validation (forms)
- domain validation (domain models)

## How to use it?

The basic idea is that you define a schema once and use it to extract the static types for Output and Error:

```ts
import { record, string, union, literal } from '@beerstack/nope';

const TodoSchema = record({
    id: string(),
    content: string(),
    status: union([literal('COMPLETE'), literal('INCOMPLETE')]),
});

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
        id: Either<string, Array<StringError>>;
        content: Either<string, Array<StringError>>;
        status: Either<'COMPLETE' | 'INCOMPLETE', UnionError>;
    }
}
*/

```

So now you have defined a schema and you have extracted the static types for Success and Error to be used across your codebase. How do we validate data with this schema? Glad you asked:

```ts
const either = TodoSchema.validate({
    id: '42',
    content: 'some content',
    status: 'INCOMPLETE',
});
```

This would be successful, since the data matches our schema definition. If the data would look different it may fail. Thats why i named the result `either`. The `validate` function does not throw, it returns a `Either<Success, Failure>` type, as you may have noticed already in the `TodoError` type. Ok. Now we have seen how we would declare and use such a schema. In the next section we will have a look on the basic idea and how the `string()` schema constructor is implemented.

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
<S, F>(either: Either<S, F>): either is Success<S>
```

This is a type guard. A type guard is a simple function which should return true if the passed argument is of the type that you have specified with the `is` syntax. For example, if you call `isSuccess` with an `Either<Success, Failure>` type, and it returns true, typescript will know that it is of type `Success` and in the else block, it will know that it is of type `Failure`.

```ts
const either = TodoSchema.validate({
    id: '42',
    content: 'some content',
    status: 'INCOMPLETE',
});

if (isSuccess(either)) {
    const { value } = either; // value is of type: Todo
} else {
    const { value } = either; // value is of type: TodoError
}
```

Awesome! Now lets define a very simple `string()` schema constructor:

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
    const I = null as unknown as string; // phantom type for Input
    const O = null as unknown as string; // phantom type for Output
    const E = null as unknown as StringError; // phantom type for Error

    const validate = (input: typeof I): Either<typeof O, typeof E> =>
        typeof input === 'string' ? success(input) : failure(input);

    return {
        schema: 'string' as const,
        I,
        O,
        E,
        validate,
    };
};
```

The `stringError` function returns a error object. its completely up to you how the shape of the error object looks. The most important property is: `code`. This should be a unique error code across all of the possible errors, across all of the schemas. Thats why we have labelled it with `as const`. This ensures that it is not of type `string` but of type `E_NOT_A_STRING`. So no other string is assignable to this. I have found out that it will become handy later to also return a `schema` property set to the type: `string` via the `as const` keyword.

The `string` function returns a object with some properties. Let me explain why we need them. We know already that we will need a validate function that returns a `Either<Success, Failure>` type. So in this specific case of a string schema: `Either<string, StringError>`. But we will also need 3 phantom types, namely: `I`, `O` and `E`. Those properties are set to `null` for all of the schemas, but we manually set it to the Input, Output and Error types of the current schema via the `as unknown as SomeType` syntax. This basically tells typescript to shut up because you know what you are doing. This makes it easy to extract the types for `Success` and `Failure` later on:

```ts
const schema = string();

type Input = typeof schema['I']; // string
type Output = typeof schema['O']; // string
type Error = typeof schema['E']; // StringError
```

The phantom types `I` and `O` are the same for all of the primitive schemas like: string, number, boolean, date, record, array, ... but they can be different for domain types in your application. Imagine a `Email` or a `Uuid` type. Both are of the primitive type: `string`. But they have some additional validation in order to be a valid email address or uuid. Unfortunately we cannot simply alias it like this: `type Email = string` and ensure the validation in the validate function, because typescript has no support for opaque types and will always fall back to string in compiler error messages. I am currently looking into a solution for this and i will maybe write another blog post about this topic 😊.

The awesome thing about this is that you can combine all of those little schema constructors together to form really complex objects.

## Example

Here is a example of a schema that you could build with some primitive schema constructors. Also this is possible today with [@beerstack/nope](https://github.com/jarvispact/nope)

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

See how awesome this is? You dont need to define a single type upfront. Just define your schema that you can use to validate your data and extract the types from it. Every possible error on any level, has a unique `code` and is strongly typed. That means you can react to every possible error in a different way at runtime and have a lot information about every error available.