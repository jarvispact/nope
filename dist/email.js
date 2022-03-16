import { string } from './string';
import { createError, getErrorDetails, extendSchema } from './utils';
const err = (input) => createError('email', 'E_NO_EMAIL', 'input is not of type: "email"', getErrorDetails('email', input));
export const email = extendSchema(string, {
    uri: 'email',
    is: (input) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
    create: (input) => input,
    err,
});
//# sourceMappingURL=email.js.map