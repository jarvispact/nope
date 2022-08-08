/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, isRecord, objectKeys, schema, } from './utils';
const uri = 'record';
export const record = (definition) => {
    const _schema = schema({
        uri,
        displayString: `record({${objectKeys(definition)
            .map((key) => `${key.toString()}: ${definition[key].displayString}`)
            .join(', ')}})`,
        is: (input) => isRecord(input) &&
            objectKeys(definition).every((defKey) => definition[defKey].is(input[defKey])),
        err: (input, { displayString }) => isRecord(input)
            ? {
                error: null,
                properties: objectKeys(definition).reduce((accum, defKey) => {
                    accum[defKey] = definition[defKey].validate(input[defKey]);
                    return accum;
                }, {}),
            }
            : {
                error: createError(uri, 'E_RECORD', `input: "${input}" is not of type: ${displayString}`),
                properties: {},
            },
    });
    return {
        ..._schema,
        definition,
        collectErrors: () => null,
    };
};
//# sourceMappingURL=record.js.map