/* eslint-disable @typescript-eslint/no-explicit-any */
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
export const createError = (uri, code, message, details = {}) => ({
    uri,
    code,
    message,
    details,
});
export const createSchema = ({ uri, is, create, validate, serialize, }) => {
    const I = null;
    const O = null;
    const E = null;
    const defaultserialize = () => uri;
    return {
        I,
        O,
        E,
        uri,
        is,
        create,
        validate: (input) => validate(input, {
            uri,
            is,
            create,
            serialize: serialize || defaultserialize,
        }),
        serialize: serialize || defaultserialize,
    };
};
export const extendSchema = (schema, { uri, is, create, err, validate, }) => {
    if (err) {
        return extendSchemaWithErrorConstructor(schema, {
            uri,
            is,
            create,
            err,
        });
    }
    else if (validate) {
        return extendSchemaWithValidateFunction(schema, {
            uri,
            is,
            create,
            validate,
        });
    }
    throw new Error('you need to provide a "err" or "validate" function');
};
const extendSchemaWithValidateFunction = (schema, { uri, is, create, validate, }) => {
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
const extendSchemaWithErrorConstructor = (schema, { uri, is, create, err, }) => {
    return createSchema({
        uri,
        is: (input) => schema.is(input) && is(input),
        create,
        validate: (input) => {
            const either = schema.validate(input);
            const result = is(input)
                ? success(create(input))
                : failure(err(input));
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
export const getDisplayType = (value) => {
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