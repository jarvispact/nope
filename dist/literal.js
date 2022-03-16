import { createError, success, failure, identity, getErrorDetails, createSchema, } from './utils';
const err = (input, literal) => createError('literal', 'E_NO_LITERAL', `input is not of type: "literal(${typeof literal === 'string' ? `"${literal}"` : literal})"`, getErrorDetails('literal', input));
export const literal = (literal) => createSchema({
    uri: 'literal',
    is: (input) => input === literal,
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input))
            return success(create(input));
        return failure(err(input, literal));
    },
    serialize: () => typeof literal === 'string'
        ? `literal("${literal}")`
        : `literal(${literal})`,
});
//# sourceMappingURL=literal.js.map