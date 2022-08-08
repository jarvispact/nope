import { number } from './number';
import { createError, schema } from './utils';
const uri = 'float';
export const float = schema({
    uri,
    is: (input) => number.is(input),
    err: (input) => createError(uri, 'E_FLOAT', `input: "${input}" is not of type: ${uri}`),
});
//# sourceMappingURL=float.js.map