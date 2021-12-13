/* eslint-disable @typescript-eslint/no-explicit-any */
import { err, getDisplayType } from './internal-utils';
import { Either, failure, Schema, success } from './utils';

const booleanError = (input: unknown) =>
    err(
        'boolean',
        'E_NOT_A_BOOLEAN',
        'provided value is not of type: "boolean"',
        {
            provided: {
                type: getDisplayType(input),
                value: input,
            },
            expected: {
                type: 'boolean',
            },
        },
    );

type BooleanError = ReturnType<typeof booleanError>;

export const boolean = (): Schema<boolean, boolean, BooleanError> => {
    const I = null as unknown as boolean;
    const O = null as unknown as boolean;
    const E = null as unknown as BooleanError;

    const validate = (input: typeof I): Either<typeof O, typeof E> =>
        typeof input === 'boolean'
            ? success(input)
            : failure(booleanError(input));

    return {
        schema: 'boolean',
        I,
        O,
        E,
        validate,
    };
};
