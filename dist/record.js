/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, success, failure, getErrorDetails, identity, createSchema, isObject, objectKeys, } from './utils';
const errNoRecord = (input) => createError('record', 'E_NO_RECORD', 'input is not of type: "record"', getErrorDetails('record', input));
const errMissingProperties = (input, requiredProperties) => createError('record', 'E_MISSING_RECORD_PROPERTIES', 'input is missing record properties', { ...getErrorDetails('record', input), requiredProperties });
const errUnexpectedProperties = (input, requiredProperties) => createError('record', 'E_UNEXPECTED_RECORD_PROPERTIES', 'input has unexpected record properties', { ...getErrorDetails('record', input), requiredProperties });
export const record = (definition) => createSchema({
    uri: 'record',
    is: (input) => isObject(input) &&
        objectKeys(input).length === objectKeys(definition).length &&
        objectKeys(definition).every((k) => definition[k].is(input[k])),
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input)) {
            return success(create(input));
        }
        if (!isObject(input)) {
            return failure({
                error: errNoRecord(input),
                properties: null,
            });
        }
        if (objectKeys(input).length < objectKeys(definition).length) {
            return failure({
                error: errMissingProperties(input, Object.keys(definition)),
                properties: null,
            });
        }
        if (objectKeys(input).length > objectKeys(definition).length) {
            return failure({
                error: errUnexpectedProperties(input, Object.keys(definition)),
                properties: null,
            });
        }
        return failure({
            error: null,
            properties: objectKeys(definition).reduce((accum, key) => {
                accum[key] = definition[key].validate(input[key]);
                return accum;
            }, {}),
        });
    },
});
//# sourceMappingURL=record.js.map