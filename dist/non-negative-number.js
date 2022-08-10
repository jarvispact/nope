import { NumberSchema } from './number';
import { createError, schema } from './utils';
const uri = 'NonNegativeNumber';
const errorCode = 'E_NON_NEGATIVE_NUMBER';
export const NonNegativeNumberSchema = schema({
    uri: uri,
    is: (input) => NumberSchema.is(input) && input >= 0,
    err: (input, { uri }) => createError(uri, errorCode, `input: "${input}" is not of type: ${uri}`, input),
});
//# sourceMappingURL=non-negative-number.js.map