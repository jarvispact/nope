/* eslint-disable @typescript-eslint/no-explicit-any */
import { err, getDisplayType } from './internal-utils';
import { failure, success } from './utils';
const numberError = (input) => err('number', 'E_NOT_A_NUMBER', 'provided value is not of type: "number"', {
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
        throw new Error('number() was called with an empty constraints array. provide at least 1 constraint or call number() without array argument.');
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
            return c.error(input);
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
    error: (input) => {
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
//# sourceMappingURL=number.js.map