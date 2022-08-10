import { createError, schema } from './utils';
const uri = 'StringSchema';
const errorCode = 'E_STRING_SCHEMA';
export const StringSchema = schema({
    uri,
    is: (input) => typeof input === 'string',
    err: (input) => createError(uri, errorCode, `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=string.js.map