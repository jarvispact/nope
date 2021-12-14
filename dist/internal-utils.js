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
//# sourceMappingURL=internal-utils.js.map