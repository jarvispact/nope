import {
    createError,
    extendValidation,
    ObjectSchema,
    StringSchema,
    StringValidation,
    UuidSchema,
    withValidations,
} from '../lib/nope';

const StringMinLengthValidation = (minLength: number) =>
    extendValidation(StringValidation)({
        is: (input): input is string => input.length >= minLength,
        err: createError({ code: 'E_STRING_MIN_LENGTH' }),
    });

const StringMaxLengthValidation = (maxLength: number) =>
    extendValidation(StringValidation)({
        is: (input): input is string => input.length <= maxLength,
        err: createError({ code: 'E_STRING_MAX_LENGTH' }),
    });

export const PersonSchema = ObjectSchema({
    id: UuidSchema,
    firstname: StringSchema,
    lastname: StringSchema,
    other: withValidations(StringSchema, [StringMinLengthValidation(1), StringMaxLengthValidation(3)]),
});
