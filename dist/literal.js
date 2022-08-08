import { createError, schema } from './utils';
const uri = 'literal';
export const literal = (literal) => schema({
    uri,
    displayString: `${uri}(${literal})`,
    is: (input) => input === literal,
    err: (input) => createError(uri, 'E_LITERAL', `input: "${input}" is not of type: ${uri}(${literal})`, input),
});
//# sourceMappingURL=literal.js.map