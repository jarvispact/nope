import { createError, schema } from './utils';
const uri = 'LiteralSchema';
const errorCode = 'E_LITERAL_SCHEMA';
export const LiteralSchema = (literal) => schema({
    uri,
    displayString: `${uri}(${literal})`,
    is: (input) => input === literal,
    err: (input) => createError(uri, errorCode, `input: "${input}" is not of type: ${uri}(${literal})`, input),
});
//# sourceMappingURL=literal.js.map