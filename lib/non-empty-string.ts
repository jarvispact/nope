import { string, StringSchema } from './string';
import { createError, Opaque, getErrorDetails, extendSchema } from './utils';

const uri = 'non-empty-string';

export type NonEmptyString = Opaque<string, typeof uri>;

const err = (input: StringSchema['I']) =>
    createError(
        uri,
        'E_NON_EMPTY_STRING',
        `input is not of type: "${uri}"`,
        getErrorDetails(uri, input),
    );

type Err = ReturnType<typeof err>;

export const nonEmptyString = extendSchema<
    StringSchema,
    string,
    NonEmptyString,
    Err,
    'non-empty-string'
>(string, {
    uri,
    is: (input): input is NonEmptyString => input !== '',
    create: (input) => input as NonEmptyString,
    err,
});

export type NonEmptyStringSchema = typeof nonEmptyString;
