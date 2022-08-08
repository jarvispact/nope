import { createError, schema } from './utils';
const uri = 'string';
export const string = schema({
    uri,
    is: (input) => typeof input === uri,
    err: (input) => createError(uri, 'E_STRING', `input: "${input}" is not of type: ${uri}`),
});
//# sourceMappingURL=string.js.map