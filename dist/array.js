/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, failure, schema, success, } from './utils';
export const array = (itemSchema) => {
    const _schema = schema({
        uri: 'array',
        is: (arrayInput) => Array.isArray(arrayInput) ? arrayInput.every(itemSchema.is) : false,
        validate: (arrayInput, { uri, is }) => {
            if (is(arrayInput))
                return success(arrayInput);
            if (!Array.isArray(arrayInput))
                return failure({
                    error: createError(uri, 'E_ARRAY', `input: "${arrayInput}" is not of type array`),
                    items: [],
                });
            return failure({
                error: null,
                items: arrayInput.map(itemSchema.validate),
            });
        },
    });
    return {
        ..._schema,
    };
};
//# sourceMappingURL=array.js.map