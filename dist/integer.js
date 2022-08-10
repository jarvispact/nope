import { NumberSchema } from './number';
import { createError, schema } from './utils';
const uri = 'IntegerSchema';
const errorCode = 'E_INTEGER_SCHEMA';
export const IntegerSchema = schema({
    uri,
    is: (input) => NumberSchema.is(input) && Number.isInteger(input),
    err: (input) => createError(uri, errorCode, `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=integer.js.map