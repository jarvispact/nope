import { NumberSchema } from './number';
import { createError, schema } from './utils';
const uri = 'FloatSchema';
const errorCode = 'E_FLOAT_SCHEMA';
export const FloatSchema = schema({
    uri,
    is: (input) => NumberSchema.is(input),
    err: (input) => createError(uri, errorCode, `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=float.js.map