import {
    createError,
    createSchema,
    success,
    failure,
    identity,
    getErrorDetails,
} from './utils';

const uri = 'string';

const err = (input: string) =>
    createError(
        uri,
        'E_NO_STRING',
        `input is not of type: "${uri}"`,
        getErrorDetails(uri, input),
    );

type Err = ReturnType<typeof err>;

export const string = createSchema<string, string, Err, 'string'>({
    uri,
    is: (input): input is string => typeof input === uri,
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input)) return success(create(input));
        return failure(err(input));
    },
});

export type StringSchema = typeof string;
