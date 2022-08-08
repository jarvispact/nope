import { createError, schema, SchemaError } from './utils';

const uri = 'null';

export const nullSchema = schema<
    typeof uri,
    null,
    null,
    SchemaError<typeof uri, 'E_NULL', null>
>({
    uri,
    is: (input) => input === null,
    err: (input) =>
        createError(
            uri,
            'E_NULL',
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type NullSchema = typeof nullSchema;
