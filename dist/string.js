import { err, createSchema, success, failure, identity, getErrorDetails, } from './utils';
const errNoString = (input) => err('string', 'E_NO_STRING', 'input is not of type: "string"', getErrorDetails('string', input));
export const string = createSchema({
    uri: 'string',
    is: (input) => typeof input === 'string',
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input))
            return success(create(input));
        return failure(errNoString(input));
    },
});
//# sourceMappingURL=string.js.map