/* eslint-disable @typescript-eslint/no-explicit-any */
import { err, failure, getDisplayType, success, } from './utils';
const schema = 'array';
export const notAArray = (input) => err(schema, 'E_NOT_A_ARRAY', 'provided value is not of type array', {
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
        throw new Error('empty constraints array is not allowed. provide at least 1 constraint or omit the empty array from the call to number()');
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
            const { code, message, details } = c.error(input);
            return err(schema, code, message, details);
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
        schema,
        I,
        O,
        E,
        validate,
    };
};
export const arrayConstraint = ({ when, error, }) => ({
    when,
    error,
});
//# sourceMappingURL=array.js.map