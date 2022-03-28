import { string } from './string';
import { createError, getErrorDetails, extendSchema } from './utils';
const uri = 'date-string';
const err = (input) => createError(uri, 'E_NO_DATE_STRING', `input is not of type: "${uri}"`, getErrorDetails(uri, input));
export const dateString = extendSchema(string, {
    uri,
    is: (input) => /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/i.test(input) &&
        new Date(input).toString() !== 'Invalid Date',
    create: (input) => input,
    err,
});
//# sourceMappingURL=date-string.js.map