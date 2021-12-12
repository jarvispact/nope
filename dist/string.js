/* eslint-disable @typescript-eslint/no-explicit-any */
import { err, failure, getDisplayType, success, } from './utils';
const stringError = (input) => err('string', 'E_NOT_A_STRING', 'provided value is not of type string', {
    provided: {
        type: getDisplayType(input),
        value: input,
    },
    expected: {
        type: 'string',
    },
});
export const string = (constraints) => {
    if (Array.isArray(constraints) && constraints.length < 1) {
        throw new Error('empty constraints array is not allowed. provide at least 1 constraint or omit the empty array from the call to string()');
    }
    const I = null;
    const O = null;
    const E = null;
    const validate = (input) => {
        if (typeof input !== 'string')
            return failure([stringError(input)]);
        const errors = (constraints || [])
            .map((c) => {
            if (!c.when(input))
                return undefined;
            const { code, message, details } = c.error(input);
            return err('string', code, message, details);
        })
            .filter(Boolean);
        return errors.length ? failure(errors) : success(input);
    };
    return {
        schema: 'string',
        I,
        O,
        E,
        validate,
    };
};
export const stringConstraint = ({ when, error, }) => ({
    when,
    error,
});
//# sourceMappingURL=string.js.map