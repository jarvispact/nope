import { StringSchema } from './string';
import { createError, Opaque, schema, SchemaError } from './utils';

const uri = 'NonEmptyStringSchema';
const errorCode = 'E_NON_EMPTY_STRING';

export type NonEmptyString = Opaque<string, typeof uri>;

export const NonEmptyStringSchema = schema<
    typeof uri,
    string,
    NonEmptyString,
    SchemaError<typeof uri, typeof errorCode, string>
>({
    uri: uri,
    is: (input) => StringSchema.is(input) && input !== '',
    err: (input, { uri }) =>
        createError(
            uri,
            errorCode,
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type NonEmptyStringSchema = typeof NonEmptyStringSchema;
