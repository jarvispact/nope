import { string } from './string';
import { createError, Opaque, schema, SchemaError } from './utils';

const uri = 'email';

export type Email = Opaque<string, typeof uri>;

export const email = schema<
    typeof uri,
    string,
    Email,
    SchemaError<typeof uri, 'E_EMAIL'>
>({
    uri,
    is: (input) =>
        string.is(input) &&
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
    err: (input) =>
        createError(uri, 'E_EMAIL', `input: "${input}" is not of type: ${uri}`),
});

export type EmailSchema = typeof email;
