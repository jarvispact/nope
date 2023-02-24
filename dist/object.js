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
const hasAllKeysFromShape = (shape, input) => {
    const inputKeys = Object.keys(input);
    return Object.keys(shape).every((key) => inputKeys.includes(key));
};
const hasAdditionalProperties = (shape, input) => {
    return Object.keys(shape) < Object.keys(input);
};
const defaultOptions = {
    failOnAdditionalProperties: true,
};
export const ObjectValidation = (shape, options) => {
    const opts = { ...defaultOptions, ...options };
    return validation({
        is: (input) => {
            if (!isObject(input))
                return false;
            if (!hasAllKeysFromShape(shape, input))
                return false;
            if (opts.failOnAdditionalProperties && hasAdditionalProperties(shape, input)) {
                return false;
            }
            return Object.keys(shape).every((key) => shape[key].is(input[key]));
        },
        err: (input, ctx) => {
            if (!isObject(input)) {
                return createError({
                    code: 'E_OBJECT',
                })(input, ctx);
            }
            if (!hasAllKeysFromShape(shape, input)) {
                return createError({ code: 'E_OBJECT_MISSING_KEYS' })(input, ctx);
            }
            if (opts.failOnAdditionalProperties && hasAdditionalProperties(shape, input)) {
                return createError({ code: 'E_OBJECT_ADDITIONAL_KEYS' })(input, ctx);
            }
            return createError({
                code: 'E_OBJECT_PROPERTY',
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
};
export const ObjectSchema = (shape, options) => schema({
    uri: 'ObjectSchema',
    displayString: shapeToDisplayString(shape),
    create: (input) => input,
    validation: ObjectValidation(shape, options),
});
//# sourceMappingURL=object.js.map