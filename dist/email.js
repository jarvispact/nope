import { string } from './string';
import { createError, getErrorDetails, extendSchema } from './utils';
const uri = 'email';
const err = (input) => createError(uri, 'E_NO_EMAIL', `input is not of type: "${uri}"`, getErrorDetails(uri, input));
export const email = extendSchema(string, {
    uri,
    is: (input) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
    create: (input) => input,
    err,
});
//# sourceMappingURL=email.js.map