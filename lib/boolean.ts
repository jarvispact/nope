import {
    createError,
    createSchema,
    success,
    failure,
    identity,
    getErrorDetails,
} from './utils';

const uri = 'boolean';

const err = (input: boolean) =>
    createError(
        uri,
        'E_NO_BOOLEAN',
        'input is not of type: "boolean"',
        getErrorDetails(uri, input),
    );

type Err = ReturnType<typeof err>;

export const boolean = createSchema<boolean, boolean, Err, 'boolean'>({
    uri,
    is: (input): input is boolean => typeof input === uri,
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input)) return success(create(input));
        return failure(err(input));
    },
});

export type BooleanSchema = typeof boolean;
