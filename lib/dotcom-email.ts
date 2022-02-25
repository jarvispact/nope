import { email, EmailSchema } from './email';
import {
    err,
    success,
    failure,
    Opaque,
    extendSchema,
    getErrorDetails,
} from './utils';

type DotcomEmail = Opaque<string, 'DotcomEmail'>;

const errNoDotcomEmail = (input: unknown) =>
    err(
        'dotcomEmail',
        'E_NO_DOT_COM_EMAIL',
        'input is not of type: "dotcomEmail"',
        getErrorDetails('dotcomEmail', input),
    );

type ErrNoDotComEmail = ReturnType<typeof errNoDotcomEmail>;

export const createDotcomEmail = (input: string) => input as DotcomEmail;

export const dotcomEmail = extendSchema<
    EmailSchema,
    string,
    DotcomEmail,
    ErrNoDotComEmail,
    'dotcomEmail'
>(email(), {
    uri: 'dotcomEmail',
    is: (input): input is DotcomEmail =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.com$/i.test(input),
    create: createDotcomEmail,
    validate: (input, { is, create }) => {
        if (is(input)) return success(create(input));
        return failure(errNoDotcomEmail(input));
    },
});

export type DotcomEmailSchema = ReturnType<typeof dotcomEmail>;
