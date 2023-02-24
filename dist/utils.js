/* eslint-disable @typescript-eslint/no-explicit-any */
// UTILS
export const objectKeys = (obj) => Object.keys(obj);
export const isObject = (v) => typeof v === 'object' && !Array.isArray(v) && v !== null && !(v instanceof Date);
const defaultOptions = {
    maxArrayDisplayProperties: 3,
    maxObjectDisplayProperties: 3,
};
export const inputToDisplayString = (value, options) => {
    const opts = { ...defaultOptions, ...options };
    switch (typeof value) {
        case 'string':
            return `'${value}'`;
        case 'number':
        case 'boolean':
            return value.toString();
        case 'object': {
            if (value === null)
                return 'null';
            if (value instanceof Date)
                return 'Date';
            if (Array.isArray(value)) {
                const additionalItemsCount = Math.max(0, value.length - opts.maxArrayDisplayProperties);
                const items = value
                    .slice(0, opts.maxArrayDisplayProperties)
                    .map((item) => inputToDisplayString(item, opts))
                    .join(', ');
                return value.length > 0
                    ? `[ ${items}${additionalItemsCount > 0 ? `, + ${additionalItemsCount} more` : ''} ]`
                    : '[]';
            }
            const keys = Object.keys(value);
            const additionalKeyCount = Math.max(0, keys.length - opts.maxObjectDisplayProperties);
            const pairs = keys
                .slice(0, opts.maxObjectDisplayProperties)
                .map((key) => `${key}: ${inputToDisplayString(value[key], opts)}`)
                .join(', ');
            return keys.length > 0
                ? `{ ${pairs}${additionalKeyCount > 0 ? `, + ${additionalKeyCount} more` : ''} }`
                : '{}';
        }
        case 'undefined':
            return 'undefined';
        default:
            return 'unknown';
    }
};
export const err = (value) => ({ status: 'ERR', value });
export const ok = (value) => ({ status: 'OK', value });
export const isErr = (either) => either.status === 'ERR';
export const isOk = (either) => either.status === 'OK';
export const unwrapEither = (either) => {
    if (isErr(either))
        throw new Error('Cannot not unwrap either');
    return either.value;
};
// MATCH
export const matchEither = (either, { onOk, onErr }) => (isOk(either) ? onOk(either.value) : onErr(either.value));
export const matchObjectProperties = (eitherObject, { onOk, onErr }) => ({ eitherObject, onOk, onErr });
export const createError = ({ code, message, details }) => (input, ctx) => ({
    code,
    message: message || `input: ${inputToDisplayString(input)}, does not match the type of: '${ctx.displayString}'`,
    details: (details ? { ...ctx, ...details } : ctx),
});
export const validation = (validation) => validation;
export const extendValidation = (wrappedValidation) => (newValidation) => ({
    is: (input) => wrappedValidation.is(input) && newValidation.is(input),
    err: (input, ctx) => {
        if (!wrappedValidation.is(input))
            return wrappedValidation.err(input, ctx);
        return newValidation.err(input, ctx);
    },
});
export const withValidations = (s, validations) => schema({
    uri: s.uri,
    create: s.create,
    validation: validation({
        is: (input) => s.is(input) && validations.every((v) => v.is(input)),
        err: (input, ctx) => {
            if (!s.is(input))
                return s.err(input, ctx);
            const v = validations.find((v) => !v.is(input));
            return v?.err(input, ctx);
        },
    }),
});
export const schema = ({ uri, displayString = uri, create, validation, }) => {
    const validate = (input) => validation.is(input) ? ok(create(input)) : err(validation.err(input, { uri, displayString }));
    return {
        uri,
        displayString,
        is: validation.is,
        create,
        err: validation.err,
        validate,
    };
};
//# sourceMappingURL=utils.js.map