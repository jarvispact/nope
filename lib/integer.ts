import { number, NumberSchema } from './number';
import { createError, Opaque, getErrorDetails, extendSchema } from './utils';

const uri = 'integer';

export type Integer = Opaque<number, typeof uri>;

const err = (input: NumberSchema['I']) =>
    createError(
        uri,
        'E_NO_INTEGER',
        `input is not of type: "${uri}"`,
        getErrorDetails(uri, input),
    );

type Err = ReturnType<typeof err>;

export const integer = extendSchema<
    NumberSchema,
    number,
    Integer,
    Err,
    'integer'
>(number, {
    uri,
    is: (input): input is Integer => Number.isInteger(input),
    create: (input) => input as Integer,
    err,
});

export type IntegerSchema = typeof integer;
