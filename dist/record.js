/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, isObject, objectKeys, schema, validation } from './utils';
export const RecordValidation = (item) => validation({
    is: (input) => isObject(input) && Object.values(input).every(item.is),
    err: (input, ctx) => {
        if (!isObject(input))
            return createError({ code: 'E_RECORD' })(input, ctx);
        return createError({
            code: 'E_RECORD_PROPERTY',
            details: {
                properties: objectKeys(input).reduce((accum, key) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    accum[key] = item.validate(input[key]);
                    return accum;
                }, {}),
            },
        })(input, ctx);
    },
});
export const RecordSchema = (item) => schema({
    uri: 'RecordSchema',
    displayString: `RecordSchema( ${item.displayString} )`,
    create: (input) => input,
    validation: RecordValidation(item),
});
//# sourceMappingURL=record.js.map