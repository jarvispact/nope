import { createError, schema } from './utils';
const uri = 'number';
export const number = schema({
    uri,
    is: (input) => typeof input === uri,
    err: (input) => createError(uri, 'E_NUMBER', `input: "${input}" is not of type: ${uri}`),
});
//# sourceMappingURL=number.js.map