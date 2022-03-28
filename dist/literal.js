import { createError, success, failure, identity, getErrorDetails, createSchema, } from './utils';
const uri = 'literal';
const err = (input, readableType) => createError(uri, 'E_NO_LITERAL', `input is not of type: "${readableType}"`, getErrorDetails(uri, input));
export const literal = (literal) => createSchema({
    uri: uri,
    is: (input) => input === literal,
    create: identity,
    validate: (input, { is, create, serialize }) => {
        if (is(input))
            return success(create(input));
        return failure(err(input, serialize()));
    },
    serialize: () => typeof literal === 'string'
        ? `literal("${literal}")`
        : `literal(${literal})`,
});
//# sourceMappingURL=literal.js.map