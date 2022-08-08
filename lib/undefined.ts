import { createError, schema, SchemaError } from './utils';

const uri = 'undefined';

export const undefinedSchema = schema<
    typeof uri,
    undefined,
    undefined,
    SchemaError<typeof uri, 'E_UNDEFINED'>
>({
    uri,
    is: (input) => input === undefined,
    err: (input) =>
        createError(
            uri,
            'E_UNDEFINED',
            `input: "${input}" is not of type: ${uri}`,
        ),
});

export type UndefinedSchema = typeof undefinedSchema;
