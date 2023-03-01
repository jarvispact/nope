/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, schema, validation } from './utils';
export const TupleValidation = (items) => validation({
    is: (input) => Array.isArray(input) && items.every((item, idx) => item.is(input[idx])),
    err: (input, ctx) => {
        if (!Array.isArray(input))
            return createError({ code: 'E_TUPLE' })(input, ctx);
        return createError({
            code: 'E_TUPLE_ITEM',
            details: { items: items.map((item, idx) => item.validate(input[idx])) },
        })(input, ctx);
    },
});
export const TupleSchema = (...items) => schema({
    uri: 'TupleSchema',
    displayString: `TupleSchema( [ ${items.map((item) => item.displayString).join(', ')} ] )`,
    create: (input) => input,
    validation: TupleValidation(items),
});
//# sourceMappingURL=tuple.js.map