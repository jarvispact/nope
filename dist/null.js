import { createError, schema } from './utils';
const uri = 'NullSchema';
const errorCode = 'E_NULL_SCHEMA';
export const NullSchema = schema({
    uri,
    is: (input) => input === null,
    err: (input) => createError(uri, errorCode, `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=null.js.map