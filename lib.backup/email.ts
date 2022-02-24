import {
    err,
    createSchema,
    success,
    failure,
    identity,
    Opaque,
    extendSchema,
} from './utils';

const errNoString = (input: unknown) =>
    err('string', 'E_NO_STRING', 'input is not of type: "string"', {
        expectedType: 'string',
        providedValue: input,
    });

type ErrNoString = ReturnType<typeof errNoString>;

const string = createSchema<string, string, ErrNoString, 'string'>({
    uri: 'string',
    is: (input): input is string => typeof input === 'string',
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input)) return success(create(input));
        return failure([errNoString(input)]);
    },
});

type StringSchema = ReturnType<typeof string>;

// ================================= email

type Email = Opaque<string, 'email'>;

const errNoEmail = (input: unknown) =>
    err('email', 'E_NO_EMAIL', 'input is not of type: "email"', {
        expectedType: 'email',
        providedValue: input,
    });

type ErrNoEmail = ReturnType<typeof errNoEmail>;

export const email = extendSchema<StringSchema, Email, ErrNoEmail, 'email'>(
    string(),
    {
        uri: 'email',
        is: (input): input is Email =>
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
        create: (input: string) => input as Email,
        validate: (input, { is, create }) => {
            if (is(input)) return success(create(input));
            return failure([errNoEmail(input)]);
        },
    },
);
