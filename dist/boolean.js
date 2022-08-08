import { createError, schema } from './utils';
const uri = 'boolean';
export const boolean = schema({
    uri,
    is: (input) => typeof input === uri,
    err: (input) => createError(uri, 'E_BOOLEAN', `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=boolean.js.map