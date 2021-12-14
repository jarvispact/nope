/* eslint-disable @typescript-eslint/no-explicit-any */
import { err, getDisplayType } from './internal-utils';
import { failure, success } from './utils';
export const notAArray = (input) => err('array', 'E_NOT_A_ARRAY', 'provided value is not of type: "array"', {
    provided: {
        type: getDisplayType(input),
        value: input,
    },
    expected: {
        type: 'array',
    },
});
export const array = (wrappedSchema, constraints) => {
    if (Array.isArray(constraints) && constraints.length < 1) {
        throw new Error('array() was called with an empty constraints array. provide at least 1 constraint or call array() without array argument.');
    }
    const I = null;
    const O = null;
    const E = null;
    const validate = (input) => {
        if (!Array.isArray(input)) {
            return failure({
                errors: [notAArray(input)],
                items: [],
            });
        }
        const constraintErrors = (constraints || [])
            .map((c) => {
            if (!c.when(input))
                return undefined;
            return c.error(input);
        })
            .filter(Boolean);
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
        schema: 'array',
        I,
        O,
        E,
        validate,
    };
};
export const arrayConstraint = ({ when, error, }) => ({
    when,
    error: (input) => {
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
//# sourceMappingURL=array.js.map