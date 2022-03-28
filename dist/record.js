/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, success, failure, getErrorDetails, identity, createSchema, isObject, objectKeys, } from './utils';
const uri = 'record';
const errNoRecord = (input, humanReadableType) => createError(uri, 'E_NO_RECORD', `input is not of type: "${humanReadableType}"`, getErrorDetails(uri, input));
const errMissingProperties = (input, requiredProperties) => createError(uri, 'E_RECORD_MISSING_PROPERTIES', 'input is missing record properties', { ...getErrorDetails(uri, input), requiredProperties });
const errUnexpectedProperties = (input, requiredProperties) => createError(uri, 'E_RECORD_UNEXPECTED_PROPERTIES', 'input has unexpected record properties', { ...getErrorDetails(uri, input), requiredProperties });
export const record = (definition, options = {}) => createSchema({
    uri: uri,
    is: (input) => {
        if (!isObject(input))
            return false;
        const definitionKeys = objectKeys(definition);
        const definitionKeysLength = definitionKeys.length;
        const inputKeys = objectKeys(input);
        const inputKeysLength = inputKeys.length;
        const requiredKeys = options.requiredProperties || objectKeys(definition);
        if (options.requiredProperties &&
            options.requiredProperties.length !== definitionKeysLength) {
            const inputSatisfiesRequiredProperties = inputKeysLength >= options.requiredProperties.length &&
                inputKeysLength <= definitionKeysLength;
            return (inputSatisfiesRequiredProperties &&
                requiredKeys.every((k) => definition[k].is(input[k])));
        }
        const inputSatisfiesRequiredProperties = inputKeysLength === definitionKeysLength;
        return (inputSatisfiesRequiredProperties &&
            requiredKeys.every((k) => definition[k].is(input[k])));
    },
    create: identity,
    validate: (input, { is, create, serialize }) => {
        if (is(input)) {
            return success(create(input));
        }
        if (!isObject(input)) {
            return failure({
                error: errNoRecord(input, serialize()),
                properties: null,
            });
        }
        const requiredKeys = options.requiredProperties || objectKeys(definition);
        if (objectKeys(input).length < requiredKeys.length) {
            return failure({
                error: errMissingProperties(input, options.requiredProperties ||
                    Object.keys(definition)),
                properties: null,
            });
        }
        if (objectKeys(input).length > objectKeys(definition).length) {
            return failure({
                error: errUnexpectedProperties(input, options.requiredProperties ||
                    Object.keys(definition)),
                properties: null,
            });
        }
        return failure({
            error: null,
            properties: requiredKeys.reduce((accum, key) => {
                accum[key] = definition[key].validate(input[key]);
                return accum;
            }, {}),
        });
    },
    serialize: () => {
        const serializedObj = Object.keys(definition)
            .map((key) => [`${key}: `, `${definition[key].serialize()}`].join(''))
            .join(', ');
        return `record({ ${serializedObj} })`;
    },
});
//# sourceMappingURL=record.js.map