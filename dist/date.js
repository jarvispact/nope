import { createError, createSchema, success, failure, identity, getErrorDetails, } from './utils';
const uri = 'date';
const err = (input) => createError(uri, 'E_NO_DATE', `input is not of type: "${uri}"`, getErrorDetails(uri, input));
export const date = createSchema({
    uri,
    is: (input) => input instanceof Date && input.toString() !== 'Invalid Date',
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input))
            return success(create(input));
        return failure(err(input));
    },
});
//# sourceMappingURL=date.js.map