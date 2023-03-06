# @jarvistack/nope
a functional and schema based validation library for typescript with static type inference (also for all possible errors).


## Introduction

Thanks to Typescript you can catch a lot of bugs at the time of writing your code, but you will still encounter bugs at runtime if you dont carefully validate your input data. On the server you would validate inputs like:

- request payloads
- upstream service responses
- environment variables

On the client your inputs come from:

- user input (forms)
- api responses

By carefully validating all inputs at the edges of our application we can ensure that the data at runtime really matches our types. This library comes with the following features to help you with that concern:

- 😎 Dont write a single type yourself, infer them from your schema!
- 💪 Strongly typed data and error objects
- 🤷‍♂️ Automatic human friendly error messages
- 0️⃣ No dependencies
- 🪶 Lightweight ( 2.8 kB )
- 🌴 Tree-shakeable
- ⚡ Fast ( 6x faster than [zod](https://zod.dev/) )
- 🧷 First class support for opaque (branded) types
- 🏗️ Create your own schemas and types, with just a few lines of code

## Getting started

1. Install: `npm i -S @jarvistack/nope`
2. Define a schema and infer the type from it:

```ts
const PersonSchema = ObjectSchema({
    name: StringSchema,
    email: EmailSchema,
});

type Person = InferType<typeof PersonSchema>; // { name: string, email: Email }
```

3. Validate your input data:

```ts
const input = {
    name: 'Tony Stark',
    email: 'tony@starkindustries.com',
};

const either = PersonSchema.validate(input);

if (isOk(either)) {
    // typeof person is of type `Person` in here
    const person = either.value;
} else {
    // typeof errCode: "E_OBJECT" | "E_OBJECT_MISSING_KEYS" | "E_OBJECT_ADDITIONAL_KEYS" | "E_OBJECT_PROPERTY"
    const errCode = either.value.code;
}
```

Thats all. Inside of the `if` branch it is guaranteed that your data matches the schema that you have specified and in the `else` branch you can see that all the possible errors are strongly typed:

- `E_OBJECT` The input is not of type object
- `E_OBJECT_MISSING_KEYS` The input is a object, but some keys are missing
- `E_OBJECT_ADDITIONAL_KEYS` The input is a object, but there were additional keys on the input object
- `E_OBJECT_PROPERTY` The input is a object and the exact amount of keys are present, but some nested validation failed.

There are more detailled informations and a automatic human readable error message available for each possible error object. [Here is a interactive example](https://stackblitz.com/edit/typescript-xfxd8x?file=index.ts).

## Opague (branded) types

This library makes heavy use of opaque ( sometimes also called branded ) types. One example would be the `Email` type that comes from the `EmailSchema`. It is not a alias for the string type, but its very own type. Let me show you why this might be useful. Here you can see that we can pass a empty string to the `sendEmail` function and typescript will not complain 😟.

```ts
const sendEmail = (email: string) => { /* TODO: send email */ };
sendEmail('');
```

By declaring something with an `EmailSchema`, the data will be typed with an opaque (branded) type called `Email`. You still have all the string functions available on it and it behaves like a normal string in your code. But by declaring a argument with the `Email` type, you will get a type error when you try to pass a normal (potential empty) string to it:

```ts
const sendEmail = (email: Email) => { /* TODO: send email */ };

// Argument of type 'string' is not assignable to parameter of type 'Email'.
sendEmail('');

const either = EmailSchema.validate('tony@starkindustries.com');
if (isOk(either)) {
    // typeof email: `Email`
    const email = either.value;
    // it is ensured at runtime that `email` is a valid email address
    sendEmail(email);
}
```

We can create the `Email` type from just 1 place in our codebase. This adds another layer of typesafety to your application. You can avoid always validating your variables before using it, but this will also remove the runtime checks. **So only use this if you know what you are doing**:

```ts
// typeof email: `Email`
const email = EmailSchema.create('tony@starkindustries.com');
sendEmail(email);
```

If you dont like this concept of an opaque type you can always opt out of it but keep the full runtime typesafety and strongly typed errors by just using the `EmailValidation` with a `StringSchema`:

```ts
const MyStringEmailSchema = withValidations(StringSchema, [EmailValidation]);

const either = MyStringEmailSchema.validate('tony@starkindustries.com');
if (isOk(either)) {
    either.value; // typeof `either.value`: string
} else {
    const errCode = either.value.code; // typeof `errCode`: "E_STRING" | "E_EMAIL"
}
```

## Builtin Schemas

- `ArraySchema`
- `BooleanSchema`
- `DateSchema`
- `EmailSchema`
- `IntSchema`
- `Iso8601DateTimeSchema`
- `Iso8601DateSchema`
- `Iso8601TimeSchema`
- `LiteralSchema`
- `NullSchema`
- `NumberSchema`
- `ObjectSchema`
- `RecordSchema`
- `StringSchema`
- `TupleSchema`
- `UIntSchema`
- `UndefinedSchema`
- `UnionSchema`
- `UuidSchema`

## Builtin Validations

- `ArrayValidation`
- `BooleanValidation`
- `DateValidation`
- `EmailValidation`
- `IntValidation`
- `Iso8601DateTimeValidation`
- `Iso8601DateValidation`
- `Iso8601TimeValidation`
- `LiteralValidation`
- `NullValidation`
- `NumberValidation`
- `ObjectValidation`
- `RecordValidation`
- `StringValidation`
- `TupleValidation`
- `UIntValidation`
- `UndefinedValidation`
- `UnionValidation`
- `UuidValidation`

## Examples:

- [react form validation example](https://stackblitz.com/edit/vitejs-vite-znoci4?file=src/App.tsx)

Here is a example on how you would define a more complex schema:

```ts
const countries = ['AT', 'DE', 'CH'] as const;
const CountrySchema = UnionSchema(countries.map(LiteralSchema));

const AddressSchema = ObjectSchema({
    street: withValidations(StringSchema, [StringMinLength(1), StringMaxLength(255)]),
    zip: withValidations(StringSchema, [StringMinLength(1), StringMaxLength(255)]),
    city: withValidations(StringSchema, [StringMinLength(1), StringMaxLength(255)]),
    country: CountrySchema,
});

const themes = ['light', 'dark'] as const;
const ThemeSchema = UnionSchema(themes.map(LiteralSchema));

const PersonSchema = ObjectSchema({
    id: UuidSchema,
    name: withValidations(StringSchema, [StringMinLength(1), StringMaxLength(255)]),
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