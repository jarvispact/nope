import { string, StringSchema } from './string';
import {
    err,
    success,
    failure,
    Opaque,
    extendSchema,
    getErrorDetails,
} from './utils';

type Email = Opaque<string, 'Email'>;

const errNoEmail = (input: unknown) =>
    err(
        'email',
        'E_NO_EMAIL',
        'input is not of type: "email"',
        getErrorDetails('email', input),
    );

type ErrNoEmail = ReturnType<typeof errNoEmail>;

export const createEmail = (input: string) => input as Email;

export const email = extendSchema<
    StringSchema,
    string,
    Email,
    ErrNoEmail,
    'email'
>(string(), {
    uri: 'email',
    is: (input): input is Email =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
    create: createEmail,
    validate: (input, { is, create }) => {
        if (is(input)) return success(create(input));
        return failure([errNoEmail(input)]);
    },
});
