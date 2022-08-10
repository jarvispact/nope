import { StringSchema } from './string';
import { createError, schema } from './utils';
const uri = 'NonEmptyStringSchema';
const errorCode = 'E_NON_EMPTY_STRING';
export const NonEmptyStringSchema = schema({
    uri: uri,
    is: (input) => StringSchema.is(input) && input !== '',
    err: (input, { uri }) => createError(uri, errorCode, `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=non-empty-string.js.map