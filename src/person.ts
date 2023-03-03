import {
    ArraySchema,
    EmailSchema,
    Iso8601DateSchema,
    Iso8601DateTimeSchema,
    LiteralSchema,
    ObjectSchema,
    StringMaxLength,
    StringMinLength,
    StringSchema,
    UnionSchema,
    UuidSchema,
    withValidations,
} from '../lib/nope';

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

export const PersonSchema = ObjectSchema({
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
