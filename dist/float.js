import { number } from './number';
import { createError, getErrorDetails, extendSchema } from './utils';
const uri = 'float';
const err = (input) => createError(uri, 'E_NO_FLOAT', `input is not of type: "${uri}"`, getErrorDetails(uri, input));
export const float = extendSchema(number, {
    uri,
    is: (input) => input % 1 !== 0,
    create: (input) => input,
    err,
});
//# sourceMappingURL=float.js.map