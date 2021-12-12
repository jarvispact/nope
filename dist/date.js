/* eslint-disable @typescript-eslint/no-explicit-any */
import { err, failure, getDisplayType, success, } from './utils';
const notADateError = (input) => err('date', 'E_NOT_A_DATE', 'provided value is not of type date', {
    provided: {
        type: getDisplayType(input),
        value: input,
    },
    expected: {
        type: 'date',
    },
});
const invalidDateError = (input) => err('date', 'E_INVALID_DATE', 'provided date is invalid', {
    provided: {
        type: getDisplayType(input),
        value: input,
    },
    expected: {
        type: 'date',
    },
});
export const date = (constraints) => {
    if (Array.isArray(constraints) && constraints.length < 1) {
        throw new Error('empty constraints array is not allowed. provide at least 1 constraint or omit the empty array from the call to date()');
    }
    const I = null;
    const O = null;
    const E = null;
    const validate = (input) => {
        if (!(input instanceof Date)) {
            return failure([notADateError(input)]);
        }
        if (input.toString() === 'Invalid Date') {
            return failure([invalidDateError(input)]);
        }
        const errors = (constraints || [])
            .map((c) => {
            if (!c.when(input))
                return undefined;
            const { code, message, details } = c.error(input);
            return err('date', code, message, details);
        })
            .filter(Boolean);
        return errors.length ? failure(errors) : success(input);
    };
    return {
        schema: 'date',
        I,
        O,
        E,
        validate,
    };
};
export const dateConstraint = ({ when, error, }) => ({
    when,
    error,
});
//# sourceMappingURL=date.js.map