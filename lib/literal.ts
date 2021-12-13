/* eslint-disable @typescript-eslint/ban-ts-comment */
import { err, getDisplayType } from './internal-utils';
import { Either, failure, Schema, success } from './utils';

const literalError = <L, T extends string | number>(literal: L, input: T) =>
    err(
        'literal',
        'E_INVALID_LITERAL',
        `provided value is not of type: "literal(${literal})"`,
        {
            provided: {
                type: getDisplayType(input),
                value: input,
            },
            expected: {
                type: `${typeof literal}-literal`,
                literal,
            },
        },
    );

type E = ReturnType<typeof literalError>;

type LiteralSchema<I, O extends I, E> = Schema<I, O, E> & { literal: O };

export const literal = <Literal extends string | number>(
    l: Literal,
): LiteralSchema<Literal, Literal, E> => {
    const literal = l;
    const I = null as unknown as Literal;
    const O = null as unknown as Literal;
    const E = null as unknown as E;

    const validate = (input: typeof I): Either<typeof O, typeof E> =>
        input === l ? success(input) : failure(literalError(l, input));

    return {
        schema: 'literal',
        literal,
        I,
        O,
        E,
        validate,
    };
};
