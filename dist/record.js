/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, isRecord, isValid, objectKeys, schema, valueOf, } from './utils';
const uri = 'RecordSchema';
const errorCode = 'E_RECORD_SCHEMA';
const recursiveCollectErrors = (accum, path, invalidInput) => {
    if (isValid(invalidInput))
        return accum;
    const schemaError = valueOf(invalidInput);
    if ('error' in schemaError && 'properties' in schemaError) {
        if (schemaError.error !== null)
            accum.push({ path, ...schemaError.error });
        objectKeys(schemaError.properties).map((key) => {
            recursiveCollectErrors(accum, `${path}.${key}`, schemaError.properties[key]);
        });
    }
    else if ('error' in schemaError && 'items' in schemaError) {
        if (schemaError.error !== null)
            accum.push({ path, ...schemaError.error });
        schemaError.items.forEach((item, idx) => {
            recursiveCollectErrors(accum, `${path}.${idx}`, item);
        });
    }
    else {
        accum.push({ path, ...schemaError });
    }
    return accum;
};
export const RecordSchema = (definition) => {
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
                error: createError(uri, errorCode, `input: "${input}" is not of type: ${displayString}`, input),
                properties: {},
            },
    });
    const collectErrors = (invalidInput) => recursiveCollectErrors([], '$', invalidInput);
    return {
        ..._schema,
        definition,
        collectErrors,
    };
};
//# sourceMappingURL=record.js.map