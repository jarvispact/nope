import { string, StringSchema } from './string';
import { createError, Opaque, getErrorDetails, extendSchema } from './utils';

const uri = 'date-string';

export type DateString = Opaque<string, typeof uri>;

const err = (input: StringSchema['I']) =>
    createError(
        uri,
        'E_NO_DATE_STRING',
        `input is not of type: "${uri}"`,
        getErrorDetails(uri, input),
    );

type Err = ReturnType<typeof err>;

export const dateString = extendSchema<
    StringSchema,
    string,
    DateString,
    Err,
    'date-string'
>(string, {
    uri,
    is: (input): input is DateString =>
        /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/i.test(input) &&
        new Date(input).toString() !== 'Invalid Date',
    create: (input) => input as DateString,
    err,
});

export type DateStringSchema = typeof dateString;
