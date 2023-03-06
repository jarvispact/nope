import { EmailSchema, InferType, isOk, ObjectSchema, StringSchema } from '../../lib/nope';

// 1

const PersonSchema = ObjectSchema({
    name: StringSchema,
    email: EmailSchema,
});

type Person = InferType<typeof PersonSchema>; // { name: string, email: Email }

// 2

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
