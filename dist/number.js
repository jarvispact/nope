/* eslint-disable @typescript-eslint/no-explicit-any */
import { err, failure, getDisplayType, success, } from './utils';
const numberError = (input) => err('number', 'E_NOT_A_NUMBER', 'provided value is not of type number', {
    provided: {
        type: getDisplayType(input),
        value: input,
    },
    expected: {
        type: 'number',
    },
});
export const number = (constraints) => {
    if (Array.isArray(constraints) && constraints.length < 1) {
        throw new Error('empty constraints array is not allowed. provide at least 1 constraint or omit the empty array from the call to number()');
    }
    const I = null;
    const O = null;
    const E = null;
    const validate = (input) => {
        if (typeof input !== 'number')
            return failure([numberError(input)]);
        const errors = (constraints || [])
            .map((c) => {
            if (!c.when(input))
                return undefined;
            const { code, message, details } = c.error(input);
            return err('number', code, message, details);
        })
            .filter(Boolean);
        return errors.length ? failure(errors) : success(input);
    };
    return {
        schema: 'number',
        I,
        O,
        E,
        validate,
    };
};
export const numberConstraint = ({ when, error, }) => ({
    when,
    error,
});
//# sourceMappingURL=number.js.map