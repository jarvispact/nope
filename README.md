# @jarvistack/nope
a functional and schema based validation library for typescript with static type inference for data and possible errors.


## Introduction

Thanks to Typescript you can catch a lot of bugs at the time of writing your code, but you will still encounter bugs at runtime if you dont carefully validate your input data, because after compilation its just Javascript. The data your application processes comes from:

- forms
- api`s
- server environment variables
- etc.

By carefully validating all inputs we can ensure that the data at runtime really matches our types. This library comes with the following features to help you with that concern:

- 😎 Dont write types yourself, infer them from your schema!
- 💪 Strongly typed data and error objects
- 🤷‍♂️ Automatic human friendly error messages
- 0️⃣ No dependencies
- 🪶 Lightweight ( 2.8 kB )
- 🌴 Tree-shakeable
- ⚡ Fast ( 6x faster than [zod](https://zod.dev/) )
- 🧷 First class support for opaque (branded) types
- 🏗️ Easy extendable

## Getting started

1. Install: `npm i -S @jarvistack/nope`
2. Define a schema:

```ts
const PersonSchema = ObjectSchema({
    id: UuidSchema,
    name: StringSchema,
    email: EmailSchema,
    birthday: Iso8601DateSchema,
});
```

3. Infer the `Person` type from it:

```ts
type Person = InferType<typeof PersonSchema>;

// the type looks like this when you hover over `Person`:
type Person = {
    id: Uuid;
    name: string;
    email: Email;
    birthday: Iso8601Date;
}
```

4. Validate your inputs:

```ts
const input = {
    id: 'ed549470-5d70-4a26-a5af-af38e17fbd66',
    name: 'Tony Stark',
    email: 'tony@starkindustries.com',
    birthday: '1970-05-29',
};

const either = PersonSchema.validate(input);
```

5. Check if the input data is valid:

```ts
if (isOk(either)) {
    // typeof person is of type `Person` in here
    const person = either.value;
} else {
    // typeof errCode: "E_OBJECT" | "E_OBJECT_MISSING_KEYS" | "E_OBJECT_ADDITIONAL_KEYS" | "E_OBJECT_PROPERTY"
    const errCode = either.value.code;
}
```

## Opague (branded) types

This library makes heavy use of opaque ( sometimes also called branded ) types. One example would be the `Email` type that comes from the `EmailSchema`. It is not a alias for the string type, but its very own type. Let me show you why this might be useful. Here you can see that we can pass a empty string to the `sendEmail` function and typescript will not be able to help you 😟

```ts
const sendEmail = (email: string) => { /* TODO: send email */ };

sendEmail('');
```

By declaring something with an `EmailSchema`, the data will be typed with an opaque type called `Email`. You still have all the string functions available on it and it behaves like a normal string. But by declaring a argument with the `Email` type, you will get a type error when you try to pass a normal string to it:

```ts
const sendEmail = (email: Email) => { /* TODO: send email */ };

// Argument of type 'string' is not assignable to parameter of type 'Email'.
sendEmail('');

const either = EmailSchema.validate('tony@starkindustries.com');
if (isOk(either)) {
    // typeof email: `Email`
    const email = either.value;
    sendEmail(email);
}
```

We can create the `Email` type from just 1 place in our codebase. This adds another layer of typesafety to your application. You can avoid always validating your variables before using it, but this will also remove the runtime checks. **So only use this if you know what you are doing**:

```ts
const email = EmailSchema.create('tony@starkindustries.com');
sendEmail(email);
```

If you dont like this concept of an opaque type you can always opt out of it but keep the full runtime typesafety and strongly typed errors by just using the `EmailValidation` with a `StringSchema`:

```ts
export const PersonSchema = ObjectSchema({
    email: withValidations(StringSchema, [EmailValidation]),
});

type Person = InferType<typeof PersonSchema>;

// the type looks like this when you hover over `Person`:
type Person = {
    email: string;
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

## Real world example

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