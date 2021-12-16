/* eslint-disable @typescript-eslint/no-explicit-any */
import { err, getDisplayType, SchemaType } from './internal-utils';
import { Either, failure, Schema, success, SupportedSchema } from './utils';

export const notAArray = (input: Array<unknown>) =>
    err('array', 'E_NOT_A_ARRAY', 'provided value is not of type: "array"', {
        provided: {
            type: getDisplayType(input),
            value: input,
        },
        expected: {
            type: 'array',
        },
    });

export type NotAArrayError = ReturnType<typeof notAArray>;

type ArrayFailure<
    WrappedSchema extends SupportedSchema,
    C extends Constraint = never,
> = {
    errors: Array<NotAArrayError | ReturnType<C['error']>>;
    items: Array<Either<WrappedSchema['O'], WrappedSchema['E']>>;
};

type ArrayOverload = {
    <WrappedSchema extends SupportedSchema, C extends Constraint>(
        wrappedSchema: WrappedSchema,
        constraints: Array<C>,
    ): Schema<
        Array<WrappedSchema['I']>,
        Array<WrappedSchema['O']>,
        ArrayFailure<WrappedSchema, C>
    >;
    <WrappedSchema extends SupportedSchema>(
        wrappedSchema: WrappedSchema,
    ): Schema<
        Array<WrappedSchema['I']>,
        Array<WrappedSchema['O']>,
        ArrayFailure<WrappedSchema>
    >;
};

export const array: ArrayOverload = <
    WrappedSchema extends SupportedSchema,
    C extends Constraint,
>(
    wrappedSchema: WrappedSchema,
    constraints?: Array<C>,
) => {
    if (Array.isArray(constraints) && constraints.length < 1) {
        throw new Error(
            'array() was called with an empty constraints array. provide at least 1 constraint or call array() without array argument.',
        );
    }

    const I = null as unknown as Array<WrappedSchema['I']>;
    const O = null as unknown as Array<WrappedSchema['O']>;
    const E = null as unknown as ArrayFailure<WrappedSchema, C>;

    const validate = (input: typeof I): Either<typeof O, typeof E> => {
        if (!Array.isArray(input)) {
            return failure({
                errors: [notAArray(input)],
                items: [],
            });
        }

        const constraintErrors = ((constraints || []) as Array<C>)
            .map((c) => (c.when(input) ? c.error(input) : undefined))
            .filter(Boolean) as Array<ReturnType<C['error']>>;

        const items = input.map((item) => wrappedSchema.validate(item));

        const itemsHaveErrors = items.some((item) => item.status === 'FAILURE');

        if (constraintErrors.length || itemsHaveErrors) {
            return failure({
                errors: constraintErrors,
                items,
            });
        }

        return success(input);
    };

    return {
        schema: 'array' as SchemaType,
        I,
        O,
        E,
        validate,
    };
};

export const arrayConstraint = <I, C extends string, T>({
    when,
    error,
}: {
    when: (input: Array<I>) => boolean;
    error: (input: Array<I>) => { code: C; message: string; details: T };
}) => ({
    when,
    error: (input: Array<I>) => {
        const { code, message, details } = error(input);
        return err('array', code, message, {
            provided: {
                type: getDisplayType(input),
                value: input,
            },
            constraint: details,
        });
    },
});

type Constraint = ReturnType<typeof arrayConstraint>;
