import {
    createError,
    createSchema,
    success,
    failure,
    identity,
    getErrorDetails,
} from './utils';

const uri = 'date';

const err = (input: string) =>
    createError(
        uri,
        'E_NO_DATE',
        `input is not of type: "${uri}"`,
        getErrorDetails(uri, input),
    );

type Err = ReturnType<typeof err>;

export const date = createSchema<Date, Date, Err, 'date'>({
    uri,
    is: (input): input is Date =>
        input instanceof Date && input.toString() !== 'Invalid Date',
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input)) return success(create(input));
        return failure(err(input));
    },
});

export type DateSchema = typeof date;
