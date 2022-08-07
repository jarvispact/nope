import { createError, failure, schema, success } from './utils';
export const numberLiteral = (literal) => schema({
    uri: 'number-literal',
    is: (input) => input === literal,
    validate: (input, { uri, is }) => is(input)
        ? success(input)
        : failure(createError(uri, 'E_NUMBER_LITERAL', `input: "${input}" is not of type ${uri}(${literal})`)),
});
//# sourceMappingURL=number-literal.js.map