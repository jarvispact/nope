import { createError, schema } from './utils';
const uri = 'null';
export const nullSchema = schema({
    uri,
    is: (input) => input === null,
    err: (input) => createError(uri, 'E_NULL', `input: "${input}" is not of type: ${uri}`),
});
//# sourceMappingURL=null.js.map