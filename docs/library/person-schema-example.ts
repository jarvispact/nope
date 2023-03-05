import {
    EmailSchema,
    InferType,
    Iso8601DateSchema,
    isOk,
    ObjectSchema,
    StringSchema,
    UuidSchema,
} from '../../lib/nope';

const PersonSchema = ObjectSchema({
    id: UuidSchema,
    name: StringSchema,
    email: EmailSchema,
    birthday: Iso8601DateSchema,
});

type Person = InferType<typeof PersonSchema>;

// the type looks like this when you hover over `Person`:
// type Person = {
//     id: Uuid;
//     name: string;
//     email: Email;
//     birthday: Iso8601Date;
// }

const input = {
    id: 'ed549470-5d70-4a26-a5af-af38e17fbd66',
    name: 'Tony Stark',
    email: 'tony@starkindustries.com',
    birthday: '1970-05-29',
};

const either = PersonSchema.validate(input);

if (isOk(either)) {
    // typeof person is of type `Person` in here
    const person = either.value;
} else {
    // typeof errCode: "E_OBJECT" | "E_OBJECT_MISSING_KEYS" | "E_OBJECT_ADDITIONAL_KEYS" | "E_OBJECT_PROPERTY"
    const errCode = either.value.code;
}
