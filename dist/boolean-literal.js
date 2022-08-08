import { createError, schema } from './utils';
const uri = 'boolean-literal';
export const booleanLiteral = (literal) => schema({
    uri,
    displayString: `${uri}(${literal})`,
    is: (input) => input === literal,
    err: (input) => createError(uri, 'E_BOOLEAN_LITERAL', `input: "${input}" is not of type: ${uri}(${literal})`),
});
//# sourceMappingURL=boolean-literal.js.map