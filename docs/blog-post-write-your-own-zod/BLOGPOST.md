## Intro

[zod](https://zod.dev/) is a schema based validation library with static type inference. It is production ready, has a rich community and ecosystem. You should check it out if you have the need for such a library.

My approach to learn some advanced typescript concepts was to create a similar library from scratch. If you are curious, you can check it out here: [@jarvistack/nope](https://github.com/jarvispact/nope). But today's blog post is not about my library. Instead i want to explain to you how it works under the hood and how you can create something similar yourself and become a better typescript developer while doing so.

## Table of contents

- [Intro](#intro)
- [Prerequisites](#prerequisites)
- [Some utilities](#some-utilities)
- [The validation function](#the-validation-function)
- [The extendValidation function](#the-extendvalidation-function)
- [The schema function](#the-schema-function)
- [Opaque ( branded ) types](#opaque--branded--types)
- [The InferType helper](#the-infertype-helper)
- [Complex example](#complex-example)
- [Closing](#closing)

## Prerequisites

Since this is a advanced typescript topic, i will assume that you are already familiar with:

- **Union types**
- **Generics**
- **Type predicates**

If you are not, i suggest to you [another blog post](https://dev.to/jarvispact/typescript-beyond-the-basics-2ap0) where i talk a bit about type inference, union types and generics. For type predicates i can recommend [this blog post](https://fettblog.eu/typescript-type-predicates/).

---

## Some utilities

The goals for our validation library are:

- **Awesome DX:** Users of the library write no types themselves.
- **Typesafety:** The static type is inferred correctly for success and error case.
- **Runtime safety:** The value at runtime matches our validation logic.

Lets start by defining the utilities:

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

---

Now let me outline the basic principle in a example of a email validation, without any further abstractions:

```ts
// our string type predicate
const isString = (input: unknown): input is string => typeof input === 'string';
// our string type predicate that also ensures a valid email address at runtime
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

---

## The validation function

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

With this one simple function we are now able to define a `StringValidation` with just 4 lines of code:

```ts
const StringValidation = validation({
    is: (input): input is string => typeof input === 'string',
    err: () => createError('E_STRING'),
});
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
```

Even this code could be further reduced by writing a little helper function, called `extendValidation()`.

---

## The extendValidation function

```ts
const extendValidation =
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
```

The types for this function look a bit crazy, but other than the types there is not a lot going on inside of this function. But its really useful to reduce the code for validations like a `Integer`, `UnsignedInteger`, `Uuid` and many many more validations that build upon a `string` or `number`. Look how simple it is now to define the `EmailValidation`:

```ts
const EmailValidation = extendValidation(StringValidation)({
    is: (input): input is string => input.includes('@'),
    err: () => createError('E_EMAIL'),
});
```

Awesome 🤩! Half of the work is done with 2 simple functions. Now we will tackle the other half.

---

## The schema function

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

The exact same concept applies for a `EmailSchema`:

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

---

## Opaque ( branded ) types

Opaque types are not available in typescript out of the box, but we can make it work with a simple trick:

```ts
declare const tag: unique symbol;

type Tagged<Token> = {
    readonly [tag]: Token;
};

type Opaque<Type, Token = unknown> = Type & Tagged<Token>;

type Email = Opaque<string, 'Email'>;
type UnsignedInteger = Opaque<number, 'UnsignedInteger'>;
```

The `Email` type is still assignable to a string, but not vice versa. Also the `UnsignedInteger` type is still assignable to a number, but not vice versa. Typescript autocompletion is still available for string and number functions. All of the following code compiles:

```ts
const email = 'tony@starkindustries.com' as Email;
const lowercaseEmail = email.toLowerCase(); // ok

const sendEmail = (address: string) => {};
sendEmail(email); // ok
sendEmail(''); // ok
```

```ts
const lengthOfSomeList = 1 as UnsignedInteger;
const timesTen = lengthOfSomeList * 10; // ok

const getElementFromList = (list: number[], index: number) => {};
getElementFromList([], lengthOfSomeList); // ok
getElementFromList([], -1); // ok
```

But if we define a opaque type for a function argument, we cannot pass simple strings or numbers anymore:

```ts
const email = 'tony@starkindustries.com' as Email;

const sendEmail = (address: Email) => {};
sendEmail(email); // ok
sendEmail(''); // Argument of type 'string' is not assignable to parameter of type 'Email'
```

```ts
const lengthOfSomeList = 1 as UnsignedInteger;

const getElementFromList = (list: number[], index: UnsignedInteger) => {};
getElementFromList([], lengthOfSomeList); // ok
getElementFromList([], -1); // Argument of type 'number' is not assignable to parameter of type 'UnsignedInteger'
```

This lets us define a more concrete type, which leads to a safer codebase. **The above examples are not safe at runtime**. This is how we would define a `EmailSchema` with a branded type and how we can use it:

```ts
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
```

Before, i told you that the `create` function will be handy later on. We are using it here to create the type `Email` from a `string`. The `create` function itself does **not** guarantee that the variable holds a correct value at runtime, but when we use the `EmailSchema.validate()` function, and we check if the validation was ok with the `isOk()` function, we can be sure that:

- the value is of type `Email`
- and that a variable holds the correct value at runtime

If the validation failed (the else branch of the example above) you will have strongly typed error objects. Every possible error that can happen gets its own type as defined by our validations. The `validation()` and `schema()` functions in this blog post are kept extremely simple to outline the basic principle to you.

Also the examples of a `StringSchema` and a `EmailSchema` are quite simple. It starts to get more complex when you want to have a `ArraySchema` that wraps some schema for its items, or a `ObjectSchema` that wraps a object where every value in that object is another schema. But in my library [@jarvistack/nope](https://github.com/jarvispact/nope) i have proven that this abstraction of a `validation()` and a `schema()` function holds. Even for quite complex wrappers. You can get some inspiration on how to build those wrapper schemas from this repository.

---

## The InferType helper

We can now write a little helper type, that will extract the static type from any schema, no matter how complex or deep. Just like you know it from zod:

```ts
export type InferType<S extends Schema<string, any, any, SchemaError<string>>> = ReturnType<
    S['validate']
> extends Either<infer O, unknown>
    ? O
    : never;
```

And use it to extract the type from the schema:

```ts
type Email = InferType<typeof EmailSchema>; // Noice!
```

---

## Complex example

With this 3 simple functions, we are now able to build all sorts of wrappers and schemas to represent complex objects. Whenever you decide to use opaque types or not, it will make your code safer, both at compile and runtime 😍. This is a example of a complex schema that you could create with my library today. Just to show you how composable and declarative those little pieces are:

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

const ProfileSchema = ObjectSchema({
    theme: ThemeSchema,
})

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
    profile: ProfileSchema,
});
```

Now, just extract the types for all of them:

```ts
type Country = InferType<typeof CountrySchema>;
type Address = InferType<typeof AddressSchema>;
type Theme = InferType<typeof ThemeSchema>;
type Profile = InferType<typeof ProfileSchema>;
type Person = InferType<typeof PersonType>;

// these types will be 🪄 automagically 🪄 inferred for you:

type Country = "AT" | "DE" | "CH";

type Address = {
    street: string;
    zip: string;
    city: string;
    country: Country;
}

type Theme = "light" | "dark";

type Profile = {
    theme: Theme;
}

type Person = {
    id: Uuid;
    name: string;
    email: Email;
    birthday: Iso8601Date;
    importedAt: Iso8601DateTime;
    address: {
        main: Address;
        others: Address[];
    };
    profile: Profile;
}
```

![Why cant i hold all the hype](./cant_hold_the_hype.gif)

---

## Closing

When you use such a library to carefully validate all the edges of your application (all the places where you process user input and external data), you dont need to write a lot of types yourself and the code that holds your domain logic will be typesafe and resilient at runtime.

I hope that you learned something new, or that i inspired you to dig a bit deeper into this topic yourself. Also i would be very happy about feedback and suggestions to improve this blog post. Ok 👋.
