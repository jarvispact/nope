export const objectKeys = (rec) => Object.keys(rec);
export const isObject = (v) => typeof v === 'object' &&
    !Array.isArray(v) &&
    v !== null &&
    !(v instanceof Date);
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
export const isSuccess = (either) => either.status === 'SUCCESS';
export const isFailure = (either) => either.status === 'FAILURE';
export const createError = (uri, code, message) => ({ uri, code, message });
export const schema = ({ uri, is, validate, }) => {
    const _is = (input) => is(input);
    const _validate = (input) => validate(input, { is: _is, uri });
    return {
        uri,
        I: null,
        O: null,
        E: null,
        is: _is,
        validate: _validate,
    };
};
//# sourceMappingURL=utils.js.map