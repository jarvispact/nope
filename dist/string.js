import { createError, createSchema, success, failure, identity, getErrorDetails, } from './utils';
const uri = 'string';
const err = (input) => createError(uri, 'E_NO_STRING', `input is not of type: "${uri}"`, getErrorDetails(uri, input));
export const string = createSchema({
    uri,
    is: (input) => typeof input === uri,
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input))
            return success(create(input));
        return failure(err(input));
    },
});
//# sourceMappingURL=string.js.map