import {
    createError,
    success,
    failure,
    identity,
    getErrorDetails,
    createSchema,
} from './utils';

const err = <T extends string | number | boolean>(input: unknown, literal: T) =>
    createError(
        'literal',
        'E_NO_LITERAL',
        `input is not of type: "literal(${
            typeof literal === 'string' ? `"${literal}"` : literal
        })"`,
        getErrorDetails('literal', input),
    );

type Err = ReturnType<typeof err>;

export const literal = <T extends string | number | boolean>(literal: T) =>
    createSchema<T, T, Err, 'literal'>({
        uri: 'literal',
        is: (input): input is T => input === literal,
        create: identity,
        validate: (input, { is, create }) => {
            if (is(input)) return success(create(input));
            return failure(err(input, literal));
        },
        serialize: () =>
            typeof literal === 'string'
                ? `literal("${literal}")`
                : `literal(${literal})`,
    });
