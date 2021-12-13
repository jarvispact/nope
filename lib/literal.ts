/* eslint-disable @typescript-eslint/ban-ts-comment */
import { err, getDisplayType } from './internal-utils';
import { Either, failure, Schema, success } from './utils';

const getLiteralType = (literal: string | number) =>
    typeof literal === 'string' ? 'string-literal' : 'number-literal';

const getLiteralErrorCode = (literal: string | number) =>
    typeof literal === 'string'
        ? 'E_INVALID_STRING_LITERAL'
        : 'E_INVALID_NUMBER_LITERAL';

const getLiteralErrorMessage = (literal: string | number) =>
    typeof literal === 'string'
        ? `provided value is not of type: "string-literal("${literal}")"`
        : `provided value is not of type: "number-literal(${literal})"`;

const literalError = <L extends string | number, T extends string | number>(
    literal: L,
    input: T,
) =>
    err(
        getLiteralType(literal),
        getLiteralErrorCode(literal),
        getLiteralErrorMessage(literal),
        {
            provided: {
                type: getDisplayType(input),
                value: input,
            },
            expected: {
                type: getLiteralType(literal),
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
        schema: getLiteralType(literal),
        literal,
        I,
        O,
        E,
        validate,
    };
};
