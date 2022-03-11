import {
    createError,
    createSchema,
    success,
    failure,
    identity,
    getErrorDetails,
} from './utils';

const errNoString = (input: string) =>
    createError(
        'string',
        'E_NO_STRING',
        'input is not of type: "string"',
        getErrorDetails('string', input),
    );

type ErrNoString = ReturnType<typeof errNoString>;

export const string = createSchema<string, string, ErrNoString, 'string'>({
    uri: 'string',
    is: (input): input is string => typeof input === 'string',
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input)) return success(create(input));
        return failure(errNoString(input));
    },
});

export type StringSchema = typeof string;
