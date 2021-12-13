/* eslint-disable @typescript-eslint/no-explicit-any */
import { err, getDisplayType, SchemaType } from './internal-utils';
import { Either, failure, Schema, success } from './utils';

const numberError = (input: unknown) =>
    err('number', 'E_NOT_A_NUMBER', 'provided value is not of type number', {
        provided: {
            type: getDisplayType(input),
            value: input,
        },
        expected: {
            type: 'number',
        },
    });

type NumberError = ReturnType<typeof numberError>;

type NumberOverload = {
    <C extends Constraint>(constraints: Array<C>): Schema<
        number,
        number,
        Array<NumberError | ReturnType<C['error']>>
    >;
    (): Schema<number, number, Array<NumberError>>;
};

export const number: NumberOverload = <C extends Constraint>(
    constraints?: any,
) => {
    if (Array.isArray(constraints) && constraints.length < 1) {
        throw new Error(
            'number() was called with an empty constraints array. provide at least 1 constraint or call number() without array argument.',
        );
    }

    const I = null as unknown as number;
    const O = null as unknown as number;
    const E = null as unknown as Array<NumberError | ReturnType<C['error']>>;

    const validate = (input: typeof I): Either<typeof O, typeof E> => {
        if (typeof input !== 'number') return failure([numberError(input)]);

        const errors = ((constraints || []) as Array<C>)
            .map((c) => {
                if (!c.when(input)) return undefined;
                return c.error(input);
            })
            .filter(Boolean) as Array<ReturnType<C['error']>>;

        return errors.length ? failure(errors) : success(input);
    };

    return {
        schema: 'number' as SchemaType,
        I,
        O,
        E,
        validate,
    };
};

export const numberConstraint = <I extends number, C extends string, T>({
    when,
    error,
}: {
    when: (input: I) => boolean;
    error: (input: I) => { code: C; message: string; details?: T };
}) => ({
    when,
    error: (input: I) => {
        const { code, message, details } = error(input);
        return err('number', code, message, {
            provided: {
                type: getDisplayType(input),
                value: input,
            },
            constraint: details,
        });
    },
});

type Constraint = ReturnType<typeof numberConstraint>;
