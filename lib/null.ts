import { createError, schema, SchemaError } from './utils';

const uri = 'NullSchema';
const errorCode = 'E_NULL_SCHEMA';

export const NullSchema = schema<
    typeof uri,
    null,
    null,
    SchemaError<typeof uri, typeof errorCode, null>
>({
    uri,
    is: (input) => input === null,
    err: (input) =>
        createError(
            uri,
            errorCode,
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type NullSchema = typeof NullSchema;
