import {
    LiteralSchema,
    ObjectSchema,
    RecordSchema,
    StringMaxLength,
    StringMinLength,
    StringSchema,
    TupleSchema,
    UuidSchema,
    withValidations,
} from '../lib/nope';

export const PersonSchema = ObjectSchema({
    id: UuidSchema,
    firstname: StringSchema,
    lastname: StringSchema,
    other: withValidations(StringSchema, [StringMinLength(1), StringMaxLength(3)]),
    profile: RecordSchema(StringSchema),
    tuple: TupleSchema(LiteralSchema('A'), LiteralSchema('B')),
});
