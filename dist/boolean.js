/* eslint-disable @typescript-eslint/no-explicit-any */
import { err, getDisplayType } from './internal-utils';
import { failure, success } from './utils';
const booleanError = (input) => err('boolean', 'E_NOT_A_BOOLEAN', 'provided value is not of type: "boolean"', {
    provided: {
        type: getDisplayType(input),
        value: input,
    },
    expected: {
        type: 'boolean',
    },
});
export const boolean = () => {
    const I = null;
    const O = null;
    const E = null;
    const validate = (input) => typeof input === 'boolean'
        ? success(input)
        : failure(booleanError(input));
    return {
        schema: 'boolean',
        I,
        O,
        E,
        validate,
    };
};
//# sourceMappingURL=boolean.js.map