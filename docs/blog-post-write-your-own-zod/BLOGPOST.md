# How to write your own validation library like zod

[zod](https://zod.dev/) is a schema based validation library with static type inference. It is production ready, has a rich community and ecosystem. You should check it out if you have the need for such a library. I explored this concept of a schema based validation library for a while, just to learn and to understand typescript better. My approach to learn these advanced ts concepts was to create such a library from scratch. If you are curious, you can check it out here: [@jarvistack/nope](https://github.com/jarvispact/nope).

But today's blog post is not about my library. Instead i want to explain to you how it works under the hood and how you can create something similar yourself and become a better typescript developer while doing so. Lets go!

## Table of contents

- [Prerequisites](#prerequisites)
    - [Unions](#1-unions)
    - [Generics](#2-generics)
    - [Custom type guards](#3-custom-type-guards)
- [Lets go](#lets-go)
- [The `validation()` abstraction](#the-validation-abstraction)
- [The `schema()` abstraction](#the-schema-abstraction)
- [Opaque ( branded ) types](#opaque--branded--types)
- [Complex example](#complex-example)
- [Closing](#closing)

## Prerequisites

We will make heavy use of unions, generics and custom type guards, so let me explain those real quick before we get started. **If you know these concepts already, you can just skip this section and jump right to the [Lets go](#lets-go) section.**

**Unions**

A union type is like a logical `OR` in many programming languages. It uses the pipe symbol ( `|` ). Here are some examples:

```ts
type A = 'A';
type B = 'B';
type AorB = A | B; // "A" | "B"
```

```ts
type A = { a: string };
type B = { b: number };
type AorB = A | B; // { a: string } | { b: number }
```

With this, we can create a `Either<Ok, Err>` type, that says, something is `Ok` or is a `Err`. You will see the implementation for this type in a moment, after i have covered generics.

**Generics**

A generic type is like a function argument in javascript, but on the type level. Generic types or functions take a argument of a type that is not known **yet**. It will be known to the caller of this type or function, but it is not known yet at the time of writing it. Show me examples!

```ts
// a generic type
type List<T> = { items: T[] };
type ListOfStrings = List<string>; // { items: string[]; }
type ListOfNumbers = List<number>; // { items: number[]; }

// a generic function
const identity = <T>(arg: T) => arg;
const aString = identity('some string'); // typeof `aString`: "some string"
const aNumber = identity(42); // typeof `aNumber`: 42
```

By using a generic in a function, you can see that typescript infers the types not as their primitive type ( `string` or `number` ), but as their literal type. This is extremely useful and we will make use of it later. To fix the problem that we dont know anything about the type of the passed argument in the generic type of function, we can specify a generic constraint. This allows us to actually do something with the passed argument:

```ts
const sanitize = <T extends string>(arg: T) => {
    if (arg.startsWith('<script')) throw new Error('dont be evil!');
    return arg;
};

const aString = sanitize('some string'); // typeof `aString`: "some string"
const aNumber = sanitize(42); // ts-error: Argument of type 'number' is not assignable to parameter of type 'string'
```

**Custom type guards**

A custom type guard is a function with a special type annotation that returns a boolean. If it returns true at runtime (for example inside of an `if` statement), typescript knows that the passed value is of the annotated type. Show me examples!

```ts
const isString = (arg: unknown): arg is string => typeof arg === 'string';

const value: unknown = 42;

if (isString(value)) {
    // inside of the if branch, typescript can now know that value is of type: string
    console.log(value.toUpperCase());
} else {
    // inside the else branch, it is still of type: unknown
    console.log(value.toUpperCase()); // ts-error: 'value' is of type 'unknown'
}
```

Since the topic for today are not unions, generics and custom type guards i will stop here. TODO add links to posts for union, generics and custom type guards.

## Lets go

The goals for our validation library are:

- **Awesome DX:** Users of the library write no types themselves.
- **Typesafety:** The static type is inferred correctly for success and error case.
- **Runtime safety:** The value at runtime matches our validation logic.

Lets start by defining some utilities:

```ts
type Ok<T> = { status: 'OK'; value: T };
type Err<T> = { status: 'ERR'; value: T };
type Either<S, F> = Ok<S> | Err<F>;
const err = <T>(value: T): Err<T> => ({ status: 'ERR', value });
const ok = <T>(value: T): Ok<T> => ({ status: 'OK', value });
const isErr = <O, E>(either: Either<O, E>): either is Err<E> => either.status === 'ERR';
const isOk = <O, E>(either: Either<O, E>): either is Ok<O> => either.status === 'OK';
type SchemaError<Code extends string = string> = { code: Code };
const createError = <Code extends string>(code: Code): SchemaError<Code> => ({ code });
```

Now let me outline the basic principle in a example of e email validation, without any further abstractions:

```ts
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
```

Thats all, there is nothing more to it. But thats a lot of boilerplate to write for our email validation. Lets create a simple abstraction for validations (our library code)

## The `validation()` abstraction

```ts
type Validation<Input, Output extends Input, Err extends SchemaError> = {
    is: (input: Input) => input is Output;
    err: (input: Input) => Err;
};

// we just return the argument, without doing anything to it
// this allows us to leverage typescript type inference
// and reduce the number of types our library user has to write
const validation = <Input, Output extends Input, Err extends SchemaError>(validation: Validation<Input, Output, Err>) =>
    validation;
```

With this one simple abstraction we are now able to define a `StringValidation` with just 4 lines of code:

```ts
const StringValidation = validation({
    is: (input): input is string => typeof input === 'string',
    err: () => createError('E_STRING'),
});

type StringErrCode = ReturnType<(typeof StringValidation)['err']>['code']; // "E_STRING"
```

To create our `EmailValidation` we can already reuse our `StringValidation` and with just 7 lines of code we are done:

```ts
const EmailValidation = validation({
    is: (input): input is string => StringValidation.is(input) && input.includes('@'),
    err: (input) => {
        if (!StringValidation.is(input)) return StringValidation.err(input);
        return createError('E_EMAIL');
    },
});

type EmailErrCode = ReturnType<(typeof EmailValidation)['err']>['code']; // "E_STRING" | "E_EMAIL"
```

Even this code could be further reduced by writing a little helper function, called `extendValidation()`. Here is the implementation:

```ts
const extendValidation =
    <WrappedInput, WrappedOutput extends WrappedInput, WrappedErr extends SchemaError<string>>(
        wrappedValidation: Validation<WrappedInput, WrappedOutput, WrappedErr>,
    ) =>
    <NewInput extends WrappedOutput, NewOutput extends NewInput, NewErr extends SchemaError<string>>(
        newValidation: Validation<WrappedOutput, NewOutput, NewErr>,
    ) =>
        ({
            is: (input) => wrappedValidation.is(input) && newValidation.is(input),
            err: (input) => {
                if (!wrappedValidation.is(input)) return wrappedValidation.err(input);
                return newValidation.err(input);
            },
        } as Validation<WrappedInput, NewOutput, NewErr | WrappedErr>);
```

The types for this function look a bit crazy, but we will only write it once. We can then use it to make our lives easier for various validations like a `Integer`, `UnsignedInteger`, `Uuid` validation and many many more. Look how simple it is now to define the `EmailValidation`:

```ts
const EmailValidation = extendValidation(StringValidation)({
    is: (input): input is string => input.includes('@'),
    err: () => createError('E_EMAIL'),
});

type EmailErrCode = ReturnType<(typeof EmailValidation)['err']>['code']; // "E_STRING" | "E_EMAIL"
```

Awesome 🤩! Half of the work is done with 2 simple functions. Now we will tackle the other half.

## The `schema()` abstraction

```ts
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
```

Let me show you now the complete code that's necessary to define a `StringSchema` and how to use it:

```ts
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
```

The same concept applies for a `EmailSchema`:

```ts
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
```

## Opaque ( branded ) types

Opaque types are not possible in typescript out of the box, but we can make it work with a simple trick:

```ts
declare const tag: unique symbol;

type Tagged<Token> = {
    readonly [tag]: Token;
};

type Opaque<Type, Token = unknown> = Type & Tagged<Token>;

type Email = Opaque<string, 'Email'>;
type UnsignedInteger = Opaque<number, 'UnsignedInteger'>;
```

The `Email` type is still assignable to a string, but not vice versa. Also the `Integer` type is still assignable to a number, but not vice versa. Typescript autocompletion is still available for string and number functions. For example all of the following is valid:

```ts
const email = 'tony@starkindustries.com' as Email;
const lowercaseEmail = email.toLowerCase(); // ok

const sendEmail = (address: string) => {};
sendEmail(email); // ok

// ===

const lengthOfSomeList = 1 as UnsignedInteger;
const timesTen = lengthOfSomeList * 10; // ok

const getElementFromList = (list: number[], index: number) => {};
getElementFromList([], lengthOfSomeList); // ok
```

But if we define a opaque type for a function argument, we cannot pass simple strings or numbers anymore:

```ts
const email = 'tony@starkindustries.com' as Email;

const sendEmail = (address: Email) => {};
sendEmail(email); // ok
sendEmail(''); // Argument of type 'string' is not assignable to parameter of type 'Email'

// ===

const lengthOfSomeList = 1 as UnsignedInteger;

const getElementFromList = (list: number[], index: UnsignedInteger) => {};
getElementFromList([], lengthOfSomeList); // ok
getElementFromList([], -1); // Argument of type 'number' is not assignable to parameter of type 'UnsignedInteger'
```

This lets us define a more concrete type, which leads to a safer codebase. The above examples are **not** safe at runtime, because we are simpy annotating variables with `as Email` or `as UnsignedInteger`. But we can use schemas to:

- have even stronger types
- and are also safe at runtime

This is how we would define a `EmailSchema` if we want to use a opaque (branded) type for it:

```ts
// definition

const tag = 'Email';
type Email = Opaque<string, typeof tag>;

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
```

Before, i told you that the `create` function will be handy later on. We are using it here to create the type `Email` from a `string`. The `create` function itself does **not** guarantee that the variable holds a correct value at runtime, but when we use the `EmailSchema.validate()` function, we can be sure that

- the value is of type `Email`
- and that a variable holds the correct value at runtime

If the validation failed you will have strongly typed error objects as well. Every possible error that can happen gets its own type. The `validation()` and `schema()` functions in this blog post are kept extremely simple to outline the basic principle. In my library [@jarvistack/nope](https://github.com/jarvispact/nope) there is plenty of information about every error in detail and a automatic human friendly error message. All of this without more boilerplate for the user of the library. There you will also find inpiration on how to write more complex schemas like the `ArraySchema(ItemSchema)` or the `ObjectSchema(Shape)` but the basic principle stays the same.

## Complex example

With this 3 simple functions, we are now able to build all sorts of wrappers and schemas to represent complex objects. Whenever you decide to use opaque types or not, it will make your code safer, both at compile and runtime 😍.

```ts
const countries = ['AT', 'DE', 'CH'] as const;
const CountrySchema = UnionSchema(countries.map(LiteralSchema));

const AddressSchema = ObjectSchema({
    street: StringSchema,
    zip: StringSchema,
    city: StringSchema,
    country: CountrySchema,
});

const themes = ['light', 'dark'] as const;
const ThemeSchema = UnionSchema(themes.map(LiteralSchema));

const PersonSchema = ObjectSchema({
    id: UuidSchema,
    name: StringSchema,
    email: EmailSchema,
    birthday: Iso8601DateSchema,
    importedAt: Iso8601DateTimeSchema,
    address: ObjectSchema({
        main: AddressSchema,
        others: ArraySchema(AddressSchema),
    }),
    profile: ObjectSchema({
        theme: ThemeSchema,
    }),
});
```

We can now write a little helper type, that will extract the static type from any schema, no matter how complex or deep. Just like you know it from zod:

```ts
export type InferType<S extends Schema<string, any, any, SchemaError<string>>> = ReturnType<
    S['validate']
> extends Either<infer O, unknown>
    ? O
    : never;
```

And use it to get the Person type from the schema:

```ts
type Person = InferType<typeof PersonSchema>; // Noice!
```

## Closing

I hope that you learned something new, or that i inspired you to dig a bit deeper into this topic yourself. Also i would be very happy about feedback and suggestions for improvements. Ok 👋.
