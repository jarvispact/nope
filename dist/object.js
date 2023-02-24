/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObject, schema, objectKeys, validation, createError, } from './utils';
const shapeToDisplayString = (shape) => {
    const maxDisplayProperties = 3;
    const shapeKeys = Object.keys(shape);
    const additionalFieldsCount = Math.max(0, shapeKeys.length - maxDisplayProperties);
    const fields = shapeKeys
        .map((key) => `${key}: ${shape[key].uri}`)
        .slice(0, maxDisplayProperties)
        .join(', ');
    return shapeKeys.length > 0
        ? `ObjectSchema({ ${fields}${additionalFieldsCount > 0 ? `, + ${additionalFieldsCount} more` : ''} })`
        : 'ObjectSchema({})';
};
const hasAllKeys = (shape, input) => {
    const inputKeys = Object.keys(input);
    return Object.keys(shape).every((key) => inputKeys.includes(key));
};
export const ObjectValidation = (shape) => validation({
    is: (input) => {
        if (!isObject(input))
            return false;
        if (!hasAllKeys(shape, input))
            return false;
        return Object.keys(shape).every((key) => shape[key].is(input[key]));
    },
    err: (input, ctx) => {
        if (!isObject(input)) {
            return createError({
                code: 'E_OBJECT_SHAPE',
            })(input, ctx);
        }
        if (!hasAllKeys(shape, input)) {
            return createError({ code: 'E_OBJECT_MISSING_KEYS' })(input, ctx);
        }
        return createError({
            code: 'E_OBJECT_PROPERTIES',
            details: {
                properties: objectKeys(shape).reduce((accum, key) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    accum[key] = shape[key].validate(input[key]);
                    return accum;
                }, {}),
            },
        })(input, ctx);
    },
});
export const ObjectSchema = (shape) => schema({
    uri: 'ObjectSchema',
    displayString: shapeToDisplayString(shape),
    create: (input) => input,
    validation: ObjectValidation(shape),
});
//# sourceMappingURL=object.js.map