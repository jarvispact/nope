/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, failure, isObject, objectKeys, schema, success, } from './utils';
export const record = (definition) => {
    const _schema = schema({
        uri: 'record',
        is: (input) => isObject(input) &&
            objectKeys(definition).every((defKey) => definition[defKey].is(input[defKey])),
        validate: (input, { uri, is }) => {
            if (is(input))
                return success(input);
            if (!isObject(input))
                return failure({
                    error: createError(uri, 'E_RECORD', `input: "${input}" is not of type record`),
                    properties: {},
                });
            return failure({
                error: null,
                properties: objectKeys(definition).reduce((accum, defKey) => {
                    accum[defKey] = definition[defKey].validate(input[defKey]);
                    return accum;
                }, {}),
            });
        },
    });
    return {
        ..._schema,
        definition,
        collectErrors: () => null,
    };
};
//# sourceMappingURL=record.js.map