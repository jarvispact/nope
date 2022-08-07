import { createError, failure, schema, success } from './utils';
export const booleanLiteral = (literal) => schema({
    uri: 'boolean-literal',
    is: (input) => input === literal,
    validate: (input, { uri, is }) => is(input)
        ? success(input)
        : failure(createError(uri, 'E_BOOLEAN_LITERAL', `input: "${input}" is not of type ${uri}(${literal})`)),
});
//# sourceMappingURL=boolean-literal.js.map