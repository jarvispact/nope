/* eslint-disable @typescript-eslint/no-explicit-any */
import { Either, failure, success } from '../../lib/nope';
import { err, getDisplayType } from '../../lib/internal-utils';

const stringConstraint = <I extends string, C extends string, T>({
    when,
    error,
}: {
    when: (input: I) => boolean;
    error: (input: I) => { code: C; message: string; details?: T };
}) => ({
    when,
    error: (input: I) => {
        const { code, message, details } = error(input);
        return err('string', code, message, {
            provided: {
                type: getDisplayType(input),
                value: input,
            },
            constraint: details,
        });
    },
});

const minLengthConstraint = (minLength: number) =>
    stringConstraint({
        when: (input) => input.length < minLength,
        error: () => ({
            code: 'E_MIN_STRING_LENGTH',
            message: 'input does not have the required minimum length',
            details: {
                expected: {
                    type: 'string',
                    minLength,
                },
            },
        }),
    });

const emailConstraint = () =>
    stringConstraint({
        when: (input) =>
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
        error: () => ({
            code: 'E_NOT_A_EMAIL_ADDRESS',
            message: 'it is not a valid email address',
            details: {
                expected: {
                    type: 'string',
                },
            },
        }),
    });

type Constraint = ReturnType<typeof stringConstraint>;

const stringError = (input: unknown) =>
    err('string', 'E_NOT_A_STRING', 'provided value is not of type: "string"', {
        provided: {
            type: getDisplayType(input),
            value: input,
        },
        expected: {
            type: 'string',
        },
    });

type StringError = ReturnType<typeof stringError>;

// ---

export const string = <C extends Constraint>(constraints: Array<C>) => {
    const I = null as unknown as string;
    const O = null as unknown as string;
    const E = null as unknown as Array<StringError | ReturnType<C['error']>>;

    const validate = (input: typeof I): Either<typeof O, typeof E> => {
        if (typeof input !== 'string') return failure([stringError(input)]);

        // this is the new part
        const errors = ((constraints || []) as Array<C>)
            .map((c) => (c.when(input) ? c.error(input) : undefined))
            .filter(Boolean) as Array<ReturnType<C['error']>>;

        return errors.length ? failure(errors) : success(input);
    };

    return {
        schema: 'string' as const,
        I,
        O,
        E,
        validate,
    };
};

const schema = string([emailConstraint(), minLengthConstraint(8)]);
type ErrorCode = typeof schema['E'][number]['code']; // "E_MIN_STRING_LENGTH" | "E_NOT_A_EMAIL_ADDRESS" | "E_NOT_A_STRING"
