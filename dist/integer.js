import { number } from './number';
import { createError, getErrorDetails, extendSchema } from './utils';
const uri = 'integer';
const err = (input) => createError(uri, 'E_NO_INTEGER', `input is not of type: "${uri}"`, getErrorDetails(uri, input));
export const integer = extendSchema(number, {
    uri,
    is: (input) => Number.isInteger(input),
    create: (input) => input,
    err,
});
//# sourceMappingURL=integer.js.map