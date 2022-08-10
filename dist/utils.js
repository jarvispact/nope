/* eslint-disable @typescript-eslint/no-explicit-any */
export const objectKeys = (rec) => Object.keys(rec);
export const isRecord = (v) => typeof v === 'object' &&
    !Array.isArray(v) &&
    v !== null &&
    !(v instanceof Date);
export const valid = (v) => {
    return {
        status: 'VALID',
        value: v,
    };
};
export const invalid = (v) => {
    return {
        status: 'INVALID',
        value: v,
    };
};
export const valueOf = (either) => either.value;
export const fold = (either, { onValid, onInvalid }) => isValid(either) ? onValid(either.value) : onInvalid(either.value);
export const isValid = (either) => either.status === 'VALID';
export const isInvalid = (either) => either.status === 'INVALID';
export const createError = (uri, code, message, input) => ({ uri, code, message, input });
export const schema = ({ uri, displayString = uri, is, err, validate, }) => {
    const _is = (input) => is(input);
    const _err = (input) => err(input, { uri, displayString });
    const defaultValidate = (input) => _is(input) ? valid(input) : invalid(_err(input));
    const _validate = (input) => validate
        ? validate(input, { uri, displayString, is: _is, err: _err })
        : defaultValidate(input);
    return {
        uri,
        displayString,
        I: null,
        O: null,
        E: null,
        is: _is,
        err: _err,
        validate: _validate,
    };
};
//# sourceMappingURL=utils.js.map