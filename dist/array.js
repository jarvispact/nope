/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, schema, validation } from './utils';
export const ArrayValidation = (item) => validation({
    is: (input) => Array.isArray(input) && input.every(item.is),
    err: (input, ctx) => {
        if (!Array.isArray(input))
            return createError({ code: 'E_ARRAY' })(input, ctx);
        return createError({
            code: 'E_ARRAY_ITEM',
            details: { items: input.map(item.validate) },
        })(input, ctx);
    },
});
export const ArraySchema = (item) => schema({
    uri: 'ArraySchema',
    displayString: `ArraySchema( ${item.displayString} )`,
    create: (input) => input,
    validation: ArrayValidation(item),
});
//# sourceMappingURL=array.js.map