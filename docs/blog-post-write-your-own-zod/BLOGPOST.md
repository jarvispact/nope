## Intro

[zod](https://zod.dev/) is a schema based validation library with static type inference. It is production ready, has a rich community and ecosystem. You should check it out if you have the need for such a library.

---

My approach to learn advanced typescript concepts was to create a similar library from scratch. If you are curious, you can check it out here: [@jarvistack/nope](https://github.com/jarvispact/nope). But today's blog post is not about my library. Instead i want to explain to you how it works under the hood and how you can create something similar yourself and learn something new while doing so.

---

## Table of contents

- [Intro](#intro)
- [Prerequisites](#prerequisites)
- [The basic idea](#the-basic-idea)
- [Some utilities](#some-utilities)
- [The validation function](#the-validation-function)
- [The extendValidation function](#the-extendvalidation-function)
- [The schema function](#the-schema-function)
- [Opaque ( branded ) types](#opaque--branded--types)
- [The InferType helper](#the-infertype-helper)
- [Closing](#closing)

---

## Prerequisites

Since this is a advanced typescript topic, i will assume that you are already familiar with:

- **Union types**
- **Generics**
- **Type predicates**

If you are not, i suggest to you [another blog post](https://dev.to/jarvispact/typescript-beyond-the-basics-2ap0) where i talk a bit about type inference, union types and generics. For type predicates i can recommend [this blog post](https://fettblog.eu/typescript-type-predicates/).

---

## The basic Idea

1. With a **union type** we can represent that a variable is `Either` this or that. In other terms we might say a validation was `Ok` or it had failed with an `Err`. This is how we can express this with a typescript type:

```ts
type Ok<T> = { status: 'OK'; value: T };
type Err<T> = { status: 'ERR'; value: T };
type Either<S, F> = Ok<S> | Err<F>;
```

2. With **generics** we can define a clear contract on how our schema needs to be defined and at the same time, leverage typescripts type inference and save the user of the library from having to define types themselves.

3. **Type predicates** are just functions that return a boolean. We can define even the most complex validation logic in such a boolean function, and by adding a type predicate to this function we can tell typescript that we made sure that some variable of type `Input` is of a certain `Output` type. This is a simple string type predicate function:

```ts
// `unknown` is our `Input` type
// `string` is our `Output` type
const isString = (input: unknown): input is string => typeof input === 'string';

const someInput = 42 as unknown;

if (isString(someInput)) {
    // in here `someInput` is of type `Output` (`string`)
} else {
    // in here `someInput` is still of type `Input` (`unknown`)
}
```

Now we have all the ingedients to write the most awesome validation library of all time. The goals for our validation library are:

- **Awesome DX:** Users of the library write no types themselves.
- **Typesafety:** The static type is inferred correctly for success and error case.
- **Runtime safety:** The value at runtime matches our validation logic.

---

## Some utilities

Lets start by defining some utils:

```ts
// We know that already :)
type Ok<T> = { status: 'OK'; value: T };
type Err<T> = { status: 'ERR'; value: T };
type Either<S, F> = Ok<S> | Err<F>;

// helpers to create the above types
const err = <T>(value: T): Err<T> => ({ status: 'ERR', value });
const ok = <T>(value: T): Ok<T> => ({ status: 'OK', value });

// helpers to check if a value is `Ok` or an `Err`
const isErr = <O, E>(either: Either<O, E>): either is Err<E> => either.status === 'ERR';
const isOk = <O, E>(either: Either<O, E>): either is Ok<O> => either.status === 'OK';

// helpers to create a validation error
type SchemaError<Code extends string = string> = { code: Code };
const createError = <Code extends string>(code: Code): SchemaError<Code> => ({ code });
```

With that in place, we can move on and create a `validation()` function to define a clear constract and to help us create new validations.

---

## The validation function

```ts
type Validation<Input, Output extends Input, Err extends SchemaError> = {
    // the `is` function needs to be a type predicate, which will check our input data at runtime
    is: (input: Input) => input is Output;
    // the `err` function defines how to create a error object.
    // if the `is` function returns false, we will call it
    err: (input: Input) => Err;
};

// we just return the input argument, without doing anything to it
// this allows us to leverage typescript type inference
// and reduce the number of types our library user has to write
const validation = <Input, Output extends Input, Err extends SchemaError>(validation: Validation<Input, Output, Err>) =>
    validation;
```

With this function we are now able to define a `StringValidation` with just 4 lines of code:

```ts
const StringValidation = validation({
    is: (input): input is string => typeof input === 'string',
    err: () => createError('E_STRING'),
});
```

To create a `EmailValidation` we can already reuse our `StringValidation` and with just 7 lines of code we are done:

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

This one has quite complex generic types. But other than the types, there isnt a lot going on in the code. You could build the validation library also without this function. Its really just for convenience. The simple version without generic types looks like this:

```ts
const extendValidation = (wrappedValidation: Validation) => (newValidation: Validation) => ({
    is: (input) => wrappedValidation.is(input) && newValidation.is(input),
    err: (input) => {
        if (!wrappedValidation.is(input)) return wrappedValidation.err(input);
        return newValidation.err(input);
    },
})
```

[Click here to see it with generic types, if you dare 😈](https://stackblitz.com/edit/typescript-gwd5hu?file=library.ts%3AL22-L22)

---

With that in place we can define validations like a `IntegerValidation`, `UnsignedIntegerValidation`, `UuidValidation` and many many more validations that build upon a `string` or `number`. Look how simple it is now to define the `EmailValidation`:

```ts
const EmailValidation = extendValidation(StringValidation)({
    is: (input): input is string => input.includes('@'),
    err: () => createError('E_EMAIL'),
});
```

Awesome 🤩! 2/3 of the work is done with just 2 functions. Now we will take a look on what is missing.

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

// the `create` function is needed to convert a `Input` to a `Output` type. This will be very handy later on...
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

As you can see, defining a new type is just a couple lines of code.

---

## Opaque ( branded ) types

> **_NOTE:_**  This is completely optional! Skip this section if you want to have a email address typed as `string` in your system. But we can have a stricter `Email` type that gives us some compile time guarantees if we want! Curious?

Opaque types are not available in typescript out of the box, but we can make it work with a simple trick:

```ts
// helper type (just needed once)

declare const tag: unique symbol;

type Tagged<Token> = {
    readonly [tag]: Token;
};

type Opaque<Type, Token = unknown> = Type & Tagged<Token>;

// definition of our more strict `string` and `number` types.

type Email = Opaque<string, 'Email'>;
type UnsignedInteger = Opaque<number, 'UnsignedInteger'>;
```

The `Email` type is still assignable to a string, but not vice versa. Also the `UnsignedInteger` type is still assignable to a number, but not vice versa. Typescript autocompletion is still available for string and number functions. All of the following code compiles just fine:

```ts
const email = 'tony@starkindustries.com' as Email;
const lowercaseEmail = email.toLowerCase(); // ok

const sendEmail = (emailAddress: string) => {};
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

const sendEmail = (emailAddress: Email) => {};
sendEmail(email); // ok
sendEmail(''); // Argument of type 'string' is not assignable to parameter of type 'Email'
```

```ts
const lengthOfSomeList = 1 as UnsignedInteger;

const getElementFromList = (list: number[], index: UnsignedInteger) => {};
getElementFromList([], lengthOfSomeList); // ok
getElementFromList([], -1); // Argument of type 'number' is not assignable to parameter of type 'UnsignedInteger'
```

This lets us define a more concreate / strict type, which leads to a safer codebase. This is how we would define a `EmailSchema` with a branded type and how we can use it:

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

If the validation failed (the else branch of the example above) you will have strongly typed error objects. Every possible error that can happen gets its own type as defined by our validations. The `validation()` and `schema()` functions in this blog post are kept simple to outline the basic principle to you.

---

Also the examples of a `StringSchema` and a `EmailSchema` are quite simple. It starts to get more complex when you want to have a `ArraySchema` that wraps some schema for its items, or a `ObjectSchema` that wraps a object where every value in that object is another schema. But in my library [@jarvistack/nope](https://github.com/jarvispact/nope) i have proven that this abstraction of a `validation()` and a `schema()` function holds. Even for quite complex wrappers. You can get some inspiration on how to build those wrapper schemas from my repository. Let me know in the comments if you want another blog post which shows how to create a `ArraySchema` or `ObjectSchema` in detail.

---

## The InferType helper

We can now write a little helper type, that will extract the static type from any schema, no matter how complex or deep. Just like you know it from zod:

```ts
export type InferType<S extends Schema<string, any, SchemaError>> = ReturnType<
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

## Closing

When you use such a library to carefully validate all the edges of your application (all the places where you process user input and external data), you dont need to write a lot of types yourself and the code that holds your domain logic will be typesafe and resilient at runtime.

- Here is a [interactive example](https://stackblitz.com/edit/typescript-gwd5hu?file=index.ts) for this blog post.
- Here you can see how a [more complex schema](https://stackblitz.com/edit/typescript-rekaev?file=nope-person.ts) might look like.

I hope that you learned something new, or that i inspired you to dig a bit deeper into this topic yourself. Also i would be very happy about feedback and suggestions to improve this blog post. Happy type-safety!👋.
