import { createError, createSchema, success, failure, identity, getErrorDetails, } from './utils';
const uri = 'boolean';
const err = (input) => createError(uri, 'E_NO_BOOLEAN', `input is not of type: "${uri}"`, getErrorDetails(uri, input));
export const boolean = createSchema({
    uri,
    is: (input) => typeof input === uri,
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input))
            return success(create(input));
        return failure(err(input));
    },
});
//# sourceMappingURL=boolean.js.map