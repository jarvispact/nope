/* eslint-disable @typescript-eslint/no-explicit-any */
import { err, getDisplayType } from './internal-utils';
import { failure, success } from './utils';
const notADateError = (input) => err('date', 'E_NOT_A_DATE', 'provided value is not of type: "date"', {
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
        throw new Error('date() was called with an empty constraints array. provide at least 1 constraint or call date() without array argument.');
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
            return c.error(input);
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
    error: (input) => {
        const { code, message, details } = error(input);
        return err('date', code, message, {
            provided: {
                type: getDisplayType(input),
                value: input,
            },
            constraint: details,
        });
    },
});
//# sourceMappingURL=date.js.map