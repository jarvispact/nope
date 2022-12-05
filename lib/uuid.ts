import { StringSchema } from './string';
import { createError, Opaque, schema, SchemaError } from './utils';

const uri = 'UuidSchema';
const errorCode = 'E_UUID_SCHEMA';

export type Uuid = Opaque<string, typeof uri>;

const uuidRegex =
    /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;

export const UuidSchema = schema<
    typeof uri,
    string,
    Uuid,
    SchemaError<typeof uri, typeof errorCode, string>
>({
    uri,
    is: (input) => StringSchema.is(input) && uuidRegex.test(input),
    err: (input) =>
        createError(
            uri,
            errorCode,
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type UuidSchema = typeof UuidSchema;
