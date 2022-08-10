import { createError, schema, SchemaError } from './utils';

const uri = 'DateSchema';
const errorCode = 'E_DATE_SCHEMA';

export const DateSchema = schema<
    typeof uri,
    Date,
    Date,
    SchemaError<typeof uri, typeof errorCode, Date>
>({
    uri,
    is: (input) => input instanceof Date && input.toString() !== 'Invalid Date',
    err: (input) =>
        createError(
            uri,
            errorCode,
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type DateSchema = typeof DateSchema;
