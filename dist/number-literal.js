import { createError, schema } from './utils';
const uri = 'number-literal';
export const numberLiteral = (literal) => schema({
    uri,
    displayString: `${uri}(${literal})`,
    is: (input) => input === literal,
    err: (input) => createError(uri, 'E_NUMBER_LITERAL', `input: "${input}" is not of type: ${uri}(${literal})`),
});
//# sourceMappingURL=number-literal.js.map