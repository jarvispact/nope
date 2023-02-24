/* eslint-disable @typescript-eslint/no-explicit-any */
// UTILS
export const objectKeys = (obj) => Object.keys(obj);
export const isObject = (v) => typeof v === 'object' && !Array.isArray(v) && v !== null && !(v instanceof Date);
export const inputToDisplayString = (value) => {
    switch (typeof value) {
        case 'string':
            return `'${value}'`;
        case 'number':
        case 'boolean':
            return value.toString();
        case 'object': {
            if (Array.isArray(value))
                return 'array';
            if (value === null)
                return 'null';
            if (value instanceof Date)
                return 'date';
            const keys = Object.keys(value);
            const maxDisplayProperties = 3;
            const additionalKeyCount = Math.max(0, keys.length - maxDisplayProperties);
            const pairs = keys
                .slice(0, maxDisplayProperties)
                .map((key) => `${key}: ${inputToDisplayString(value[key])}`)
                .join(', ');
            return keys.length > 0
                ? `{ ${pairs}${additionalKeyCount > 0 ? `, + ${additionalKeyCount} more` : ''} }`
                : '{}';
        }
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
    message: message || `input: ${inputToDisplayString(input)}, does not match type of: '${ctx.displayString}'`,
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