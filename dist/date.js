import { createError, schema } from './utils';
const uri = 'DateSchema';
const errorCode = 'E_DATE_SCHEMA';
export const DateSchema = schema({
    uri,
    is: (input) => input instanceof Date && input.toString() !== 'Invalid Date',
    err: (input) => createError(uri, errorCode, `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=date.js.map