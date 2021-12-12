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
export const valueOf = (either) => either.value;
export const fold = (either, { onSuccess, onFailure, }) => (isSuccess(either) ? onSuccess(either.value) : onFailure(either.value));
export const err = (schema, code, message, details) => ({
    schema,
    code,
    message,
    details,
});
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
export const isLiteralSchema = (schema) => schema.schema === 'literal';
export const isRecordSchema = (schema) => schema.schema === 'record';
//# sourceMappingURL=utils.js.map