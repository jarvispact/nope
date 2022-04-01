import { string } from './string';
import { createError, getErrorDetails, extendSchema } from './utils';
const uri = 'non-empty-string';
const err = (input) => createError(uri, 'E_NON_EMPTY_STRING', `input is not of type: "${uri}"`, getErrorDetails(uri, input));
export const nonEmptyString = extendSchema(string, {
    uri,
    is: (input) => input !== '',
    create: (input) => input,
    err,
});
//# sourceMappingURL=non-empty-string.js.map