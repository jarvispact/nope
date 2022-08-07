import { createError, failure, schema, success } from './utils';
export const stringLiteral = (literal) => schema({
    uri: 'string-literal',
    is: (input) => input === literal,
    validate: (input, { uri, is }) => is(input)
        ? success(input)
        : failure(createError(uri, 'E_STRING_LITERAL', `input: "${input}" is not of type ${uri}(${literal})`)),
});
//# sourceMappingURL=string-literal.js.map