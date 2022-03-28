import { string } from './string';
import { createError, getErrorDetails, extendSchema } from './utils';
const uri = 'uuid';
const err = (input) => createError(uri, 'E_NO_UUID', `input is not of type: "${uri}"`, getErrorDetails(uri, input));
export const uuid = extendSchema(string, {
    uri,
    is: (input) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input),
    create: (input) => input,
    err,
});
//# sourceMappingURL=uuid.js.map