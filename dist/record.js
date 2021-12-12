/* eslint-disable @typescript-eslint/no-explicit-any */
import { err, failure, getDisplayType, isObject, objectKeys, success, } from './utils';
export const notARecordError = (definition, input) => err('record', 'E_NOT_A_RECORD', 'provided value is not of type record', {
    provided: {
        type: getDisplayType(input),
        value: input,
    },
    expected: {
        type: 'record',
        keys: Object.keys(definition),
    },
});
const missingKeysError = (definition, input) => err('record', 'E_MISSING_KEYS', 'provided value has missing keys', {
    provided: {
        type: getDisplayType(input),
        value: input,
    },
    expected: {
        type: 'record',
        keys: Object.keys(definition),
    },
});
const tooManyKeysError = (definition, input) => err('record', 'E_TOO_MANY_KEYS', 'provided value has too many keys', {
    provided: {
        type: getDisplayType(input),
        value: input,
        keys: Object.keys(input),
    },
    expected: {
        type: 'record',
        keys: Object.keys(definition),
    },
});
export const record = (definition) => {
    const I = null;
    const O = null;
    const E = null;
    const validate = (input) => {
        if (!isObject(input)) {
            return failure({
                errors: [notARecordError(definition, input)],
                properties: {},
            });
        }
        const errors = [];
        if (objectKeys(definition).length > objectKeys(input).length) {
            errors.push(missingKeysError(definition, input));
        }
        if (objectKeys(input).length > objectKeys(definition).length) {
            errors.push(tooManyKeysError(definition, input));
        }
        const properties = objectKeys(definition).reduce((accum, key) => {
            accum[key] = definition[key].validate(input[key]);
            return accum;
        }, {});
        const propertiesHaveErrors = objectKeys(properties).some((k) => properties[k].status === 'FAILURE');
        if (errors.length || propertiesHaveErrors) {
            return failure({
                errors,
                properties,
            });
        }
        return success(input);
    };
    return {
        schema: 'record',
        I,
        O,
        E,
        validate,
        definition,
    };
};
//# sourceMappingURL=record.js.map