/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Either,
    err,
    failure,
    getDisplayType,
    Schema,
    SchemaType,
    success,
} from './utils';

const notADateError = (input: unknown) =>
    err('date', 'E_NOT_A_DATE', 'provided value is not of type date', {
        provided: {
            type: getDisplayType(input),
            value: input,
        },
        expected: {
            type: 'date',
        },
    });

type NotADateError = ReturnType<typeof notADateError>;

const invalidDateError = (input: unknown) =>
    err('date', 'E_INVALID_DATE', 'provided date is invalid', {
        provided: {
            type: getDisplayType(input),
            value: input,
        },
        expected: {
            type: 'date',
        },
    });

type InvalidDateError = ReturnType<typeof invalidDateError>;

type DateError = NotADateError | InvalidDateError;

type DateOverload = {
    <C extends Constraint>(constraints: Array<C>): Schema<
        Date,
        Date,
        Array<DateError | ReturnType<C['error']>>
    >;
    (): Schema<Date, Date, Array<DateError>>;
};

export const date: DateOverload = <C extends Constraint>(constraints?: any) => {
    if (Array.isArray(constraints) && constraints.length < 1) {
        throw new Error(
            'date() was called with an empty constraints array. provide at least 1 constraint or call date() without array argument.',
        );
    }

    const I = null as unknown as Date;
    const O = null as unknown as Date;
    const E = null as unknown as Array<DateError | ReturnType<C['error']>>;

    const validate = (input: typeof I): Either<typeof O, typeof E> => {
        if (!(input instanceof Date)) {
            return failure([notADateError(input)]);
        }

        if (input.toString() === 'Invalid Date') {
            return failure([invalidDateError(input)]);
        }

        const errors = ((constraints || []) as Array<C>)
            .map((c) => {
                if (!c.when(input)) return undefined;
                const { code, message, details } = c.error(input);
                return err('date', code, message, details);
            })
            .filter(Boolean) as Array<ReturnType<C['error']>>;

        return errors.length ? failure(errors) : success(input);
    };

    return {
        schema: 'date' as SchemaType,
        I,
        O,
        E,
        validate,
    };
};

export const dateConstraint = <I extends Date, C extends string, T>({
    when,
    error,
}: {
    when: (input: I) => boolean;
    error: (input: I) => { code: C; message: string; details?: T };
}) => ({
    when,
    error,
});

type Constraint = ReturnType<typeof dateConstraint>;
