/* eslint-disable @typescript-eslint/ban-ts-comment */
import { err, getDisplayType } from './internal-utils';
import { failure, success } from './utils';
const getLiteralType = (literal) => typeof literal === 'string' ? 'string-literal' : 'number-literal';
const getLiteralErrorCode = (literal) => typeof literal === 'string'
    ? 'E_INVALID_STRING_LITERAL'
    : 'E_INVALID_NUMBER_LITERAL';
const getLiteralErrorMessage = (literal) => typeof literal === 'string'
    ? `provided value is not of type: "string-literal("${literal}")"`
    : `provided value is not of type: "number-literal(${literal})"`;
const literalError = (literal, input) => err(getLiteralType(literal), getLiteralErrorCode(literal), getLiteralErrorMessage(literal), {
    provided: {
        type: getDisplayType(input),
        value: input,
    },
    expected: {
        type: getLiteralType(literal),
        literal,
    },
});
export const literal = (l) => {
    const literal = l;
    const I = null;
    const O = null;
    const E = null;
    const validate = (input) => input === l ? success(input) : failure(literalError(l, input));
    return {
        schema: getLiteralType(literal),
        literal,
        I,
        O,
        E,
        validate,
    };
};
//# sourceMappingURL=literal.js.map