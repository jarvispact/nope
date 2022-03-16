import { createError, createSchema, success, failure, identity, getErrorDetails, } from './utils';
const uri = 'number';
const err = (input) => createError(uri, 'E_NO_NUMBER', 'input is not of type: "number"', getErrorDetails(uri, input));
export const number = createSchema({
    uri,
    is: (input) => typeof input === uri,
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input))
            return success(create(input));
        return failure(err(input));
    },
});
//# sourceMappingURL=number.js.map