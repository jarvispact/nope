import { createError, schema, SchemaError } from './utils';

const uri = 'UndefinedSchema';
const errorCode = 'E_UNDEFINED_SCHEMA';

export const UndefinedSchema = schema<
    typeof uri,
    undefined,
    undefined,
    SchemaError<typeof uri, typeof errorCode, undefined>
>({
    uri,
    is: (input) => input === undefined,
    err: (input) =>
        createError(
            uri,
            errorCode,
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type UndefinedSchema = typeof UndefinedSchema;
