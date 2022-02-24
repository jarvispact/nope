export const success = (v) => {
    return {
        status: 'SUCCESS',
        value: v,
    };
};
export const failure = (v) => {
    return {
        status: 'FAILURE',
        value: v,
    };
};
export const err = (uri, code, message, 
// @ts-ignore
details = {}) => ({
    uri,
    code,
    message,
    details,
});
export const createSchema = ({ uri, is, create, validate, }) => {
    const I = null;
    const O = null;
    const E = null;
    return () => ({
        I,
        O,
        E,
        uri,
        is,
        create,
        validate: (input) => validate(input, { uri, is, create }),
    });
};
export const extendSchema = (schema, { uri, is, create, validate, }) => {
    return createSchema({
        uri,
        is: (input) => schema.is(input) && is(input),
        create,
        validate: (input, ctx) => {
            const either = schema.validate(input);
            const result = validate(input, ctx);
            const errors = [either, result]
                .filter((e) => e.status === 'FAILURE')
                .flatMap((e) => e.value);
            if (errors.length)
                return failure(errors);
            return success(input);
        },
    });
};
export const identity = (val) => val;
export const objectKeys = (rec) => Object.keys(rec);
export const isObject = (v) => typeof v === 'object' && !Array.isArray(v) && v !== null;
const getDisplayType = (value) => {
    if (value === null)
        return 'null';
    if (value instanceof Date)
        return 'date';
    if (isObject(value))
        return 'record';
    if (Array.isArray(value))
        return 'array';
    return typeof value;
};
export const getErrorDetails = (expectedType, input) => ({
    expectedType,
    providedType: getDisplayType(input),
    providedNativeType: typeof input,
    providedValue: input,
});
//# sourceMappingURL=utils.js.map