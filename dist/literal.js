/* eslint-disable @typescript-eslint/ban-ts-comment */
import { err, failure, getDisplayType, success } from './utils';
const literalError = (literal, input) => err('literal', 'E_INVALID_LITERAL', `the provided value does not match the specified literal: "${literal}"`, {
    provided: {
        type: getDisplayType(input),
        value: input,
    },
    expected: {
        type: `${typeof literal}-literal`,
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
        schema: 'literal',
        literal,
        I,
        O,
        E,
        validate,
    };
};
//# sourceMappingURL=literal.js.map