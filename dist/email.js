import { string } from './string';
import { createError, schema } from './utils';
const uri = 'email';
export const email = schema({
    uri,
    is: (input) => string.is(input) &&
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
    err: (input) => createError(uri, 'E_EMAIL', `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=email.js.map