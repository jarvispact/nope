import { createError, schema, SchemaError } from './utils';

const uri = 'BooleanSchema';
const errorCode = 'E_BOOLEAN_SCHEMA';

export const BooleanSchema = schema<
    typeof uri,
    boolean,
    boolean,
    SchemaError<typeof uri, typeof errorCode, boolean>
>({
    uri,
    is: (input) => typeof input === 'boolean',
    err: (input) =>
        createError(
            uri,
            errorCode,
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type BooleanSchema = typeof BooleanSchema;
