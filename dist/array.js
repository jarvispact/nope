/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, schema } from './utils';
const uri = 'array';
export const array = (itemSchema) => schema({
    uri,
    displayString: `array(${itemSchema.displayString})`,
    is: (arrayInput) => Array.isArray(arrayInput) ? arrayInput.every(itemSchema.is) : false,
    err: (arrayInput, { displayString }) => Array.isArray(arrayInput)
        ? {
            error: null,
            items: arrayInput.map(itemSchema.validate),
        }
        : {
            error: createError(uri, 'E_ARRAY', `input: "${arrayInput}" is not of type: ${displayString}`),
            items: [],
        },
});
//# sourceMappingURL=array.js.map