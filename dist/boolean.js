import { createError, schema } from './utils';
const uri = 'BooleanSchema';
const errorCode = 'E_BOOLEAN_SCHEMA';
export const BooleanSchema = schema({
    uri,
    is: (input) => typeof input === 'boolean',
    err: (input) => createError(uri, errorCode, `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=boolean.js.map