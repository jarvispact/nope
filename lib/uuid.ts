import { string } from './string';
import { createError, Opaque, schema, SchemaError } from './utils';

const uri = 'uuid';

export type Uuid = Opaque<string, typeof uri>;

export const uuid = schema<
    typeof uri,
    string,
    Uuid,
    SchemaError<typeof uri, 'E_UUID'>
>({
    uri,
    is: (input) =>
        string.is(input) &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            input,
        ),
    err: (input) =>
        createError(uri, 'E_UUID', `input: "${input}" is not of type: ${uri}`),
});

export type UuidSchema = typeof uuid;
