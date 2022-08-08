import { createError, schema, SchemaError } from './utils';

const uri = 'date';

export const date = schema<
    typeof uri,
    Date,
    Date,
    SchemaError<typeof uri, 'E_DATE', Date>
>({
    uri,
    is: (input) => input instanceof Date && input.toString() !== 'Invalid Date',
    err: (input) =>
        createError(
            uri,
            'E_DATE',
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type DateSchema = typeof date;
