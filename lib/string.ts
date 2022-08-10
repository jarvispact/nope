import { createError, schema, SchemaError } from './utils';

const uri = 'StringSchema';
const errorCode = 'E_STRING_SCHEMA';

export const StringSchema = schema<
    typeof uri,
    string,
    string,
    SchemaError<typeof uri, typeof errorCode, string>
>({
    uri,
    is: (input) => typeof input === 'string',
    err: (input) =>
        createError(
            uri,
            errorCode,
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type StringSchema = typeof StringSchema;
