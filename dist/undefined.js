import { createError, schema } from './utils';
const uri = 'UndefinedSchema';
const errorCode = 'E_UNDEFINED_SCHEMA';
export const UndefinedSchema = schema({
    uri,
    is: (input) => input === undefined,
    err: (input) => createError(uri, errorCode, `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=undefined.js.map