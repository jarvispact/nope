import { createError, schema } from './utils';
const uri = 'undefined';
export const undefinedSchema = schema({
    uri,
    is: (input) => input === undefined,
    err: (input) => createError(uri, 'E_UNDEFINED', `input: "${input}" is not of type: ${uri}`),
});
//# sourceMappingURL=undefined.js.map