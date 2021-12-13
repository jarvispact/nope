/* eslint-disable @typescript-eslint/no-explicit-any */
import { err, getDisplayType, SchemaType } from './internal-utils';
import { Either, failure, Schema, success } from './utils';

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

type StringOverload = {
    <C extends Constraint>(constraints: Array<C>): Schema<
        string,
        string,
        Array<StringError | ReturnType<C['error']>>
    >;
    (): Schema<string, string, Array<StringError>>;
};

export const string: StringOverload = <C extends Constraint>(
    constraints?: any,
) => {
    if (Array.isArray(constraints) && constraints.length < 1) {
        throw new Error(
            'string() was called with an empty constraints array. provide at least 1 constraint or call string() without array argument.',
        );
    }

    const I = null as unknown as string;
    const O = null as unknown as string;
    const E = null as unknown as Array<StringError | ReturnType<C['error']>>;

    const validate = (input: typeof I): Either<typeof O, typeof E> => {
        if (typeof input !== 'string') return failure([stringError(input)]);

        const errors = ((constraints || []) as Array<C>)
            .map((c) => {
                if (!c.when(input)) return undefined;
                const { code, message, details } = c.error(input);
                return err('string', code, message, details);
            })
            .filter(Boolean) as Array<ReturnType<C['error']>>;

        return errors.length ? failure(errors) : success(input);
    };

    return {
        schema: 'string' as SchemaType,
        I,
        O,
        E,
        validate,
    };
};

export const stringConstraint = <I extends string, C extends string, T>({
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

type Constraint = ReturnType<typeof stringConstraint>;
