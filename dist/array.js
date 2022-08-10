/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, schema } from './utils';
const uri = 'ArraySchema';
const errorCode = 'E_ARRAY_SCHEMA';
export const ArraySchema = (itemSchema) => schema({
    uri,
    displayString: `array(${itemSchema.displayString})`,
    is: (arrayInput) => Array.isArray(arrayInput) ? arrayInput.every(itemSchema.is) : false,
    err: (arrayInput, { displayString }) => Array.isArray(arrayInput)
        ? {
            error: null,
            items: arrayInput.map(itemSchema.validate),
        }
        : {
            error: createError(uri, errorCode, `input: "${arrayInput}" is not of type: ${displayString}`, arrayInput),
            items: [],
        },
});
//# sourceMappingURL=array.js.map