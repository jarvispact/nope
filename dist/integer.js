import { number } from './number';
import { createError, schema } from './utils';
const uri = 'integer';
export const integer = schema({
    uri,
    is: (input) => number.is(input) && Number.isInteger(input),
    err: (input) => createError(uri, 'E_INTEGER', `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=integer.js.map