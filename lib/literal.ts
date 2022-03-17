import {
    createError,
    success,
    failure,
    identity,
    getErrorDetails,
    createSchema,
} from './utils';

const uri = 'literal';

const err = (input: unknown, readableType: string) =>
    createError(
        uri,
        'E_NO_LITERAL',
        `input is not of type: "${readableType}"`,
        getErrorDetails(uri, input),
    );

type Err = ReturnType<typeof err>;

export const literal = <T extends string | number | boolean>(literal: T) =>
    createSchema<T, T, Err, 'literal'>({
        uri: uri,
        is: (input): input is T => input === literal,
        create: identity,
        validate: (input, { is, create, serialize }) => {
            if (is(input)) return success(create(input));
            return failure(err(input, serialize()));
        },
        serialize: () =>
            typeof literal === 'string'
                ? `literal("${literal}")`
                : `literal(${literal})`,
    });
