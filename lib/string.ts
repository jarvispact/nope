import {
    createError,
    createSchema,
    success,
    failure,
    identity,
    getErrorDetails,
} from './utils';

const err = (input: string) =>
    createError(
        'string',
        'E_NO_STRING',
        'input is not of type: "string"',
        getErrorDetails('string', input),
    );

type Err = ReturnType<typeof err>;

export const string = createSchema<string, string, Err, 'string'>({
    uri: 'string',
    is: (input): input is string => typeof input === 'string',
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input)) return success(create(input));
        return failure(err(input));
    },
});

export type StringSchema = typeof string;
