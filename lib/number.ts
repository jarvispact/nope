import { createError, schema, SchemaError } from './utils';

const uri = 'NumberSchema';
const errorCode = 'E_NUMBER_SCHEMA';

export const NumberSchema = schema<
    typeof uri,
    number,
    number,
    SchemaError<typeof uri, typeof errorCode, number>
>({
    uri,
    is: (input) => typeof input === 'number',
    err: (input) =>
        createError(
            uri,
            errorCode,
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type NumberSchema = typeof NumberSchema;
