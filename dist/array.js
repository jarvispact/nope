/* eslint-disable @typescript-eslint/no-explicit-any */
import { createError, success, failure, getErrorDetails, identity, createSchema, } from './utils';
const uri = 'array';
const err = (input) => createError(uri, 'E_NO_ARRAY', `input is not of type: "${uri}"`, getErrorDetails(uri, input));
export const array = (wrappedSchema) => createSchema({
    uri,
    is: (input) => Array.isArray(input) && input.every(wrappedSchema.is),
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input)) {
            return success(create(input));
        }
        if (!Array.isArray(input)) {
            return failure({ error: err(input), items: [] });
        }
        return failure({
            error: null,
            items: input.map(wrappedSchema.validate),
        });
    },
});
//# sourceMappingURL=array.js.map