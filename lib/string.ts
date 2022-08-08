import { createError, schema, SchemaError } from './utils';

const uri = 'string';

export const string = schema<
    typeof uri,
    string,
    string,
    SchemaError<typeof uri, 'E_STRING', string>
>({
    uri,
    is: (input) => typeof input === uri,
    err: (input) =>
        createError(
            uri,
            'E_STRING',
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type StringSchema = typeof string;
