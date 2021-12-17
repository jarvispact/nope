import { success, failure, Either } from '../../lib/nope';

// ---

const stringError = (input: unknown) => ({
    schema: 'string' as const,
    code: 'E_NOT_A_STRING' as const,
    message: '',
    details: {
        provided: {
            type: typeof input,
            value: input,
        },
        expected: {
            type: 'string',
        },
    },
});

type StringError = ReturnType<typeof stringError>;

export const string = () => {
    const I = null as unknown as string; // type for Input
    const O = null as unknown as string; // type for Output
    const E = null as unknown as StringError; // type for Error

    const validate = (input: typeof I): Either<typeof O, typeof E> =>
        typeof input === 'string'
            ? success(input)
            : failure(stringError(input));

    return {
        schema: 'string' as const,
        I,
        O,
        E,
        validate,
    };
};
