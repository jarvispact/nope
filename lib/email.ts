import { StringSchema } from './string';
import { createError, Opaque, schema, SchemaError } from './utils';

const uri = 'EmailSchema';
const errorCode = 'E_EMAIL_SCHEMA';

export type Email = Opaque<string, typeof uri>;

export const EmailSchema = schema<
    typeof uri,
    string,
    Email,
    SchemaError<typeof uri, typeof errorCode, string>
>({
    uri,
    is: (input) =>
        StringSchema.is(input) &&
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
    err: (input) =>
        createError(
            uri,
            errorCode,
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type EmailSchema = typeof EmailSchema;
