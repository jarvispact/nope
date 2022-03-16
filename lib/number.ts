import {
    createError,
    createSchema,
    success,
    failure,
    identity,
    getErrorDetails,
} from './utils';

const uri = 'number';

const err = (input: string) =>
    createError(
        uri,
        'E_NO_NUMBER',
        'input is not of type: "number"',
        getErrorDetails(uri, input),
    );

type Err = ReturnType<typeof err>;

export const number = createSchema<number, number, Err, 'number'>({
    uri,
    is: (input): input is number => typeof input === uri,
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input)) return success(create(input));
        return failure(err(input));
    },
});

export type NumberSchema = typeof number;
