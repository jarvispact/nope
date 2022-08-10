import { StringSchema } from './string';
import { createError, Opaque, schema, SchemaError } from './utils';

const uri = 'UuidSchema';
const errorCode = 'E_UUID_SCHEMA';

export type Uuid = Opaque<string, typeof uri>;

export const UuidSchema = schema<
    typeof uri,
    string,
    Uuid,
    SchemaError<typeof uri, typeof errorCode, string>
>({
    uri,
    is: (input) =>
        StringSchema.is(input) &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            input,
        ),
    err: (input) =>
        createError(
            uri,
            errorCode,
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type UuidSchema = typeof UuidSchema;
