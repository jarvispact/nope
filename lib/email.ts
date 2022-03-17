import { string, StringSchema } from './string';
import { createError, Opaque, getErrorDetails, extendSchema } from './utils';

const uri = 'email';

export type Email = Opaque<string, 'Email'>;

const err = (input: StringSchema['I']) =>
    createError(
        uri,
        'E_NO_EMAIL',
        `input is not of type: "${uri}"`,
        getErrorDetails(uri, input),
    );

type Err = ReturnType<typeof err>;

export const email = extendSchema<StringSchema, string, Email, Err, 'email'>(
    string,
    {
        uri,
        is: (input): input is Email =>
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
        create: (input) => input as Email,
        err,
    },
);

export type EmailSchema = typeof email;
